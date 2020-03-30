
Udagram is an image-sharing website built by each student in the Udacity
Cloud Developer Nanodegree program.  

This version of Udagram is an app written as a collection of containerized
microservices, deployed as a Kubernetes cluster of pods to the AWS cloud.
It is to be submitted for Project 3 of the Nanodegree.  Udagram will continue
to evolve in the next lesson and Project 4.

The GitHub repository for this project is:
* CharlesDoyle/udagram
* https://github.com/CharlesDoyle/udagram

This is version 1.2 of the udagram app.
Version 1.1 has the value '*' hard-coded for the CORS 
Access-Control-Allow-Origin variable.  This allows any address to come
in from the reverseproxy server. 
Version 1.2 uses an environment variable called ALLOW_ORIGIN_URL, and it has some improved documentation.

To set up the app:
* Build all of the images at once by running the docker-compose-build.yaml file
  $ docker-compose -f ./docker-compose-build.yaml build --parallel
  * Each docker image can be built individually too:
    $ docker build -t char2pie/image-name .
* The udagram-app.yaml file has all deployment settings.  It is a concatenation
  of all configurations for the deployments, services, configMap, secrets.

Edit this file to change the number of replicaSets per deployment, the image for a container, environment variables in a deployment, the names and labels of Kubernetes objects, and any settings on the services, configMap, or secrets.  
  
udagram-app.yaml is built by running 'kubectl kustomization' on the udagram-deployment directory, which has all the individual Kubernetes configuration .yaml files:
    udagram$ kubectl kustomization ./udagram_deployment > ./udagram_app.yaml
  
  Edit udagram-app.yaml to change the number of replicaSets per deployment, the image for a container, environment variables in a deployment, the names and labels of Kubernetes objects, and any settings on the services, configMap, or secrets.  

To deploy the app to an AWS cluster:
* First, create the cluster:
  KOPS_CLUSTER_NAME=charlie.k8s.local
  KOPS_STATE_STORE=s3://charlie-kops-state-store 
  udagram$ kops create cluster --node-count=1 --node-size=t2.medium --zones=us-west-2a
  udagram$ kops update cluster --name ${KOPS_CLUSTER_NAME} --yes

* Next, deploy the app to the worker nodes of the cluster:
  udagram$ kubectl apply -f udagram-app.yaml

* To see the state of the deployment in real time, open a terminal window
  and watch the deployment in real time:
  $ watch kubectl get all -o wide

* To do a rolling update by changing a container to a new image:
  $ kubectl set image deployment backend-user backend-user=char2pie/udagram-restapi-user:v1.2

* To roll back to the previous version of a deployment:
  $ kubectl rollout undo deployment backend-user

* To activate Travis CI to run .travis.yml, commit to the master branch and
  push to the GitHub repository master branch.  This version of .travis.yml doesn't do much, because at this stage of the Nanodegree we are just starting to use CI/CD.  Ultimately Travis will run automated tests of the app, and automatically deploy to the cloud. 
