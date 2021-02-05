# Kubernetes Deployments
Because all addons have almost the same Kubernetes configuration files, [Helm](https://helm.sh) is used to make maintaining these configurations easier.

Make sure you have a `stremio` namespace set up (`kubectl create ns stremio`).

## Pulling images
Currently images are stored on my private gitlab container image registry. If you wan to use your own private registry, you'll need to create a registry credentials secret: `kubectl create secret docker-registry gitlab-reg-cred --docker-server=registry.gitlab.com --docker-username=<username> --docker-password=<password> --docker-email=<email>`. Once that's done change the `imagePullSecrets` configuration option to your secret in `templates/deployment.yaml` and the node should be able to pull images like `docker pull registry.gitlab.com/sleeyax-docker/stremio/dlive:0.0.4` from now on.

## Secrets & Environment Variables
Because secrets almost never change over time and can't be stored in source control anyways, just create your secrets once using `kubectl create secret generic my-secret --from-env-file=path/to/bar.env`.

## Node selectors
Due to my personal kubernetes cluster being a mix of high quality and low(er) quality servers, by default I made sure stremio addons only deploy to lower quality servers, that have the `pro: "false"` label. If you need to change this, either edit `helm/stremio-addon/templates/deployment.yaml` or overwrite it by specifying the `nodeSelector` value in your addon values yaml. 

For example, if you want to run the dlive addon on a node that has SSD storage for whatever reason, edit `dlive.yaml` like this:
```yaml
app: dlive

nodeSelector:
  diskType: ssd

deployment:
  replicaCount: 1
  image: "registry.gitlab.com/sleeyax-docker/stremio/dlive:0.0.4" # you probably want to change this too
```

## Getting started

Example commands for deployments:
```
$ helm install dlive stremio-addon/ -f dlive.yaml -n stremio
$ helm upgrade dlive stremio-addon/ -f dlive.yaml -n stremio
```

Apply ingress nginx configuration: `helm install nginx nginx/ -n stremio` (replace `install` with `upgrade` to update the configuration).

### Stremio streaming server
Some addons might depends on a local streaming server in order to work. If you want to set that up, execute `kubectl apply -f streaming-server.yaml`.

This will set up a local [stremio-streaming-server](https://hub.docker.com/r/sleeyax/stremio-streaming-server) within your cluster. It will work like a micro service so for security reasons it's not accessible from the outside. But your addons should still be able to send requests to it by its service name `streaming-server`, of course. 

## Useful commands
Compile configuration files and show the result on screen: `helm template <addon_name> <addon_dir> -f <addon_values>.yaml`.

Same as above, but also check YAML file validity: `helm install <addon_name> stremio <addon_dir> -f <addon_values> --dry-run`.
