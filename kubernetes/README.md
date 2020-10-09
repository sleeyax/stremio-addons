# Kubernetes Deployments
Because all addons have almost the same Kubernetes configuration files, [Helm](https://helm.sh) is used to make maintaining these configurations easier.

Make sure you have a `stremio` namespace set up (`kubectl create ns stremio`).

## Pulling images
Currently images are stored on my private gitlab container image registry. If you wan to use your own private registry, you'll need to create a registry credentials secret: `kubectl create secret docker-registry gitlab-reg-cred --docker-server=registry.gitlab.com --docker-username=<username> --docker-password=<password> --docker-email=<email>`. Once that's done change the `imagePullSecrets` configuration option to your secret in `templates/deployment.yaml` and the node should be able to pull images like `docker pull registry.gitlab.com/sleeyax-docker/stremio/dlive:0.0.4` from now on.

## Secrets & Environment Variables
Because secrets almost never change over time and can't be stored in source control anyways, just create your secrets once using `kubectl create secret generic my-secret --from-env-file=path/to/bar.env`.

## Getting started
Compile configuration files and show the result on screen: `helm template <addon_name> <addon_dir> -f <addon_values>.yaml`.

Same as above, but also check YAML file validity: `helm install <addon_name> stremio <addon_dir> -f <addon_values> --dry-run`.

Example commands for deployments:
```
$ helm install dlive stremio-addon/ -f dlive-values.yaml
$ helm upgrade dlive stremio-addon/ -f dlive-values.yaml
```

Apply ingress nginx configuration: `kubectl apply -f ingress.yaml`.
