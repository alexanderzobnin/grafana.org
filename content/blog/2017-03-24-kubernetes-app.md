---
title: Monitoring Kubernetes with the Grafana Kubernetes App
author: Daniel Lee
date: 2017-03-24
aliases:
  - blog/2017/03/24/kubernetes-app.html
---

Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications. It was originally designed by Google who then donated it to the non-profit organization [Cloud Native Computing Foundation](https://www.cncf.io/). Piggybacking on the Docker adoption wave, Kubernetes has become hugely popular in the last few months and is now one of the top projects on GitHub.

At Grafana Labs, we are in the process of switching to Kubernetes for our Hosted Grafana and Hosted Metrics services. This raised the question **how do we monitor Kubernetes**?

## Switching to Kubernetes

When we set up our first test cluster, we noticed that it was not obvious what needs to be monitored. A system built on Docker containers is quite different from a system built with a configuration management tool like Chef or Puppet. We also noticed that it is not always obvious that something is broken in Kubernetes. As an example, a pod can get stuck in a restart loop where it starts up, crashes and then gets restarted by Kubernetes. If a pod has multiple replicas then this redundancy and Kubernetes' self-healing capability can hide the fact that the pod is crashing constantly and that there is a problem on one particular server.

## Why Kubernetes is difficult to monitor

Kubernetes is very different from a traditional static environment. It is a moving target with containers frequently being spun up and torn down. In Kubernetes, a runnable unit of work is called a pod and a pod runs one or more containers (usually not more than 3). Kubernetes will automatically restart failing pods, and it is standard practice to delete a pod and then roll out a new version. Within a short period, even a small cluster will have created and destroyed hundreds of pods and Docker containers.

When saving metrics to a time series database, Kubernetes can create a large number of series. Destroyed pod data is mixed with live pod data and clutters up dashboards with stale useless data. When a problem occurs, it can be difficult to sift through a long list of pods to find the culprit. A cron job that regularly deletes stale series can ease this problem but any large cluster will still generate enough data that there is a risk of missing signals about outages or potential problems. Kubernetes manages this complexity with labels. If you are a Graphite shop like us, then there is no easy way to leverage the Kubernetes labeling system from within Grafana.

## Introducing the Kubernetes App

At Grafana Labs, our internal stack for monitoring is:

1. Snap for collecting data 
2. our Graphite-compatible Hosted Metrics service, [GrafanaCloud](https://grafana.com/cloud) as our time series database
3. Grafana for the frontend

We really wanted to monitor Kubernetes with this stack and had to build some new components to achieve that. The result is the [new Kubernetes App for Grafana](https://grafana.com/plugins/raintank-kubernetes-app).

The Kubernetes App includes Snap collectors for Docker and Kubernetes as well as standard metrics and four curated Graphite dashboards  - everything you need to be able to monitor a Kubernetes cluster. It also has an App section with an UI similar to the Kubernetes dashboard if you need to see all the components in your cluster.

## Graphite and Tags

Kubernetes is built on labels which naturally aligns with tags in a time series database. The problem: Graphite does not support tags.

GrafanaLabs is working on GraphiteNG, the Next Generation version of Graphite that will focus on improving performance and adding support for tags. In the meantime, to leverage Kubernetes labels, we built a panel for pod filtering that reads the tags from Kubernetes and translates them into a list of template variables in Grafana. For example, in our Hosted Grafana service each pod has an `org` label that we use for quickly finding the live version of a customer's pod or pods in the Pod dashboard.

## Collectors Included

The collectors are deployed automatically to your cluster from Grafana so you can install the app and be collecting data in under a minute. The collectors can also be manually installed very easily. The instructions and files needed are included in the app.

![](/assets/img/blog/k8s_app_deploybutton.png)

Read more about Snap and the collectors included in the app [here](https://github.com/grafana/kubernetes-app#technical-details).

## Four Dashboards Included

The Kubernetes App comes with 4 default dashboards:

1. [Cluster](#cluster)
2. [Nodes](#nodes)
3. [Pods/Containers](#pods_containers)
4. [Deployments](#deployments)

<a name="cluster"></a>
### Cluster Dashboard

This dashboard shows metrics at the cluster level. It can answer questions about capacity and usage over the whole cluster. It can also be used to give an indication that something is wrong through the high level pod and container statistics. We built a collector to fetch this data as it is important to be able to fetch data directly from Kubernetes to alert on conditions like a Node being offline or not having enough disk space to create a new pod.

![](/assets/img/blog/k8s_app_cluster_dashboard.png)
<a name="nodes"></a>
### Nodes Dashboard

CPU, memory, disk usage and network statistics are shown here per node. A specially built panel fetches data from the Kubernetes API to show the conditions for a node. An example of a condition is the OutOfDisk condition and it means that there is not enough disk space to create a new pod on the kubelet.

![](/assets/img/blog/k8s_app_node_dashboard.png)
<a name="pods_containers"></a>
### Pods/Containers

This is where it gets difficult to monitor so we built a special panel that connects to the Kubernetes API and uses Kubernetes labels to filter pod data.

![](/assets/img/blog/k8s_app_pod_dashboard_ops.png)
<a name="deployments"></a>
### Deployments

Every deployment creates a new generation but it only increments the generation when all replicas are deployed so this dashboard can be used to identify deployments that have stalled due to errors.

![](/assets/img/blog/k8s_app_pod_dashboard_deployments.png)

## What can be monitored with the App

{{< imgbox max-width="60%" img="/assets/img/blog/k8s_alerts.png" caption="Our alert list" >}}

With the data that is collected by the Kubernetes App, you will now be able to alert on:

- cluster-level failures like a node being unavailable
- node-level failures like high memory usage
- pod/container-level failures like a pod that is crashing/restarting
- deployment-level failures like a deployment failing to complete

## Alert Example - Pod Restarts

Alert dashboards are not included in the app but all the data needed to create useful alerts is there. If you only create one alert for Kubernetes then it should be Pod Restarts. Previously in this article, we mentioned that Kubernetes is self-healing which can hide potential problems. In our experience, the best indicator that something is wrong is when pods have unscheduled restarts.

Pod restarts is collected by the kubestate collector and is available as a series in Graphite:

`snap.yourk8scluster.grafanalabs.kubestate.container.*.*.*.*.status.restarts`

A simple alert that checks if this is greater than zero is highly recommended, especially for new clusters with potential configuration problems.

## Snap Collectors

The [seven Snap collectors](https://github.com/raintank/kubernetes-app/blob/master/README.md#technical-details) that are included in the app can potentially collect a huge amount of data allowing you to investigate alerts at a lower level or to examine trends for capacity planning. The collectors in the app are currently configured to collect the data needed for the above dashboards. In future versions of the app, we will exploit the [Snap's dynamic loading of metrics](https://grafana.com/blog/2016/03/31/using-grafana-with-intels-snap-for-ad-hoc-metric-exploration/) and this will make all the metrics available to be either live streamed or saved to Graphite as needed.

## Community

The Kubernetes App and its components are all open source. The App only has support for Graphite but all the collectors are data source agnostic and easy to plug in to any time series database. We wrote a [Kubestate Snap collector](https://github.com/grafana/snap-plugin-collector-kubestate) to collect metrics from the Kubernetes API to be able to monitor at the cluster level. It is inspired by the Prometheus kube-state-collector which together with the Kubestate collector are the only collectors for Kubernetes cluster level metrics. We are looking forward to the community contributing both code and ideas to make monitoring Kubernetes better.

We are building Grafana Cloud on the Kubernetes platform. The Grafana Kubernetes App helps us to fix problems before our customers notice.

## Links

- [Install the Kubernetes App](https://grafana.com/plugins/raintank-kubernetes-app)
- [Contribute to the Kubernetes App on GitHub](https://github.com/raintank/kubernetes-app)
- [Kubernetes](https://kubernetes.io/)
- [Docker image with snap collectors on DockerHub](https://hub.docker.com/r/raintank/snap_k8s/) or [on GitHub](https://github.com/raintank/snap_k8s)
- [Kubestate Snap collector for Kubernetes statistics](https://github.com/grafana/snap-plugin-collector-kubestate)