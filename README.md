This is version 1.1 of the udagram app.
Version 1.1 has the value '*' hard-coded for the CORS 
Access-Control-Allow-Origin variable.  This allows any address to come
in from the reverseproxy server. 

To run the app on an AWS cluster:
First, create the cluster:
udagram$ kops create cluster --node-count=1 --node-size=t2.medium --zones=us-west-2a
udagram$ kops update cluster --name $KOPS_CLUSTER_NAME} --yes

Second, start the app on the worker nodes:
udagram$ kubectl apply -f udagram-app.yaml
