# Kubernetes Deployments
Because all addons have almost the same Kubernetes configuration files, [Helm](https://helm.sh) is used to make maintaining these configurations easier.

## Useful commands
Compile configuration files and show the result on screen: `helm template <addon_name> <addon_dir> -f <addon_values>.yaml`.

Same as above, but also check YAML file validity: `helm install <addon_name> stremio <addon_dir> -f <addon_values> --dry-run`.

Example commands for deployments:
```
$ helm install dlive stremio-addon/ -f dlive-values.yaml
$ helm upgrade dlive stremio-addon/ -f dlive-values.yaml
```

## Info
### Secrets & Environment Variables
Because secrets almost never change over time and can't be stored in source control anyways, just create your secrets once using `kubectl create secret generic my-secret --from-env-file=path/to/bar.env`.
