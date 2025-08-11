# Ticket App

### Tech-stacks and Tools
- NodeJs - Microservice (Typescript)
- NextJs
- Kubernetes
- Github Action
- Redis

    apps/v1 is for Deployments, ReplicaSets, StatefulSets (workloads).
    v1 is for core resources like Services, Pods, ConfigMaps.

# Some Kube commands
    kubectl get deployments -n ingress-nginx
| NAME                     | READY | UP-TO-DATE | AVAILABLE | AGE |
| ------------------------ | :---: | :--------: | :-------: | :-: |
| ingress-nginx-controller |  1/1  |      1     |     1     |  Xd |


    kubectl get svc -n ingress-nginx
| NAME                     | TYPE         | CLUSTER-IP      | EXTERNAL-IP | PORT(S)                       | AGE |
| ------------------------ | ------------ | --------------- | ----------- | ----------------------------- | --- |
| ingress-nginx-controller | LoadBalancer | xxx.xxx.xxx.xxx | `<pending>` | 80\:xxxxx/TCP, 443\:xxxxx/TCP | Xd  |



    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.13.0/deploy/static/provider/cloud/deploy.yaml

# ingress commands
    kubectl delete ingress ingress-service
    kubectl get ingress -n infra -> if namespace used else ignore -n and after
    kubectl get svc -n infra
    kubectl get pods -n infra

# clear everthing
    kubectl delete all --all --all-namespaces
    kubectl delete namespace ingress-nginx metallb-system --ignore-not-found
    kubectl delete clusterrolebinding --all
    kubectl delete clusterrole --all --ignore-not-found
    kubectl delete pv --all --ignore-not-found

# setup test nginx
### Create a test deployment
    kubectl create deployment nginx --image=nginx
    kubectl expose deployment nginx --port=80

### Create an ingress rule
    kubectl create ingress nginx --rule="example.com/*=nginx:80"

### Test it (replace with your actual IP if not using Docker Desktop)
    curl -H "Host: example.com" http://localhost

# Delete test nginx
### Delete the ingress rule
    kubectl delete ingress nginx

### Delete the service
    kubectl delete service nginx

### Delete the deployment
    kubectl delete deployment nginx

# Add a Secrete Key
    kubectl create secret generic jwt-secret --from-literal=JWT_KEY='huHuz/N5gVFKzoTiMefwIpLKC5hJ0p3/fbgvFVqwt+0='
### Get the yaml for secrete object
    kubectl get secret jwt-secret -o yaml



    User Request (example.com)  
        ↓  
    Load Balancer / NodePort (if on cloud/local)  
        ↓  
    Ingress-NGINX Controller (decides routing)  
        ↓  
    Kubernetes Service (exposes your app)  
        ↓  
    Pods (running your app)  