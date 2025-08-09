# Ticket App

### Tech-stacks and Tools
- NodeJs - Microservice (Typescript)
- NextJs
- Kubernetes
- Github Action
- Redis


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

