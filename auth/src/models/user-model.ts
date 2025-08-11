import mongoose from 'mongoose';
import { Password } from "../services/password";

// interface for user attributes
interface userAttrs {
    email: string;
    password: string;
}

// and interface that describe properties that a user model has -> built is not stored in mongoDb
interface userModel extends mongoose.Model<userDocument> {
    build(attrs: userAttrs): userDocument;
}

// properties that user document has
interface userDocument extends mongoose.Document {
    email: string;
    password: string;
    // if we have any extra properties, we can add them here like createdAt updatedAt etc
}

// document structure for mongoDb
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);


userSchema.pre("save",async function (done) {
    if(this.isModified("password")) {
        // is modified will be true when we to a new User()
        const hashed = await Password.toHash(this.get("password"));
        this.set("password", hashed);
    }
    done();
});

userSchema.statics.build = (attrs: userAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<userDocument, userModel>('User', userSchema);

User.build = (attrs: userAttrs) => {
    return new User(attrs);
}

export { User };

/*
    new User({email: "test@test.com", password: "password123"}) -> without any ts specifics

    const buildUser = (attrs: userAttrs) => {
        // if we call new User directly then ts can't do any checking -> we need to use a factory function
        return new User(attrs);
    }

    buildUser({email: "test@test.com", password: "password123"}) -> now ts can do type check

    add static method so we can function builtin -> in above code

    we have added properties to mongo but ts has no idea how user is structured -> so we need to create an interface
*/




