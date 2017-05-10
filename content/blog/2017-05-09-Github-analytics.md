+++
title = "GitHub Analytics With Elasticsearch And Grafana"
author = "torkel"
date = "2017-05-10"
draft = true
keywords = ["Grafana", "GitHub", "Elasticsearch"]
cover_image = "/assets/img/blog/github_analytics/cover.png"
description = "Export GitHub Repository data to Elasticsearch and visualize issue and comment analytics in Grafana"
+++

## The Dream

I have, for a long time, wished there was a way to easily export GitHub issues & comments to
Elasticsearch. The standard GitHub graphs for commits & traffic are great but I have
really been missing graphs and analytics on issues & comments.

If we had issues & comments in Elasticsearch, with a well-defined index mapping, we could do some
interesting analytics. For example:

- Look at project history in terms of issues created
- Look at project history in terms of comments (can be a measure of community engagement)
- See how different labels trend over time.
- Look at distributions (histograms) on the number of issues or comments created per user. Are there a few very active users that represent 70% or 90% of all issues & comments?
- How long does PRs stay open?
- How long do issues stay unresponded?

## Why Elasticsearch?

Elasticsearch is not only a document search DB. Its real power is in the kinds of aggregations you can do. This is why
Elasticsearch has become such a great tool for log analytics or data analytics in general. It's not ideal for
the high volume & high-resolution time series workloads that most time series databases can handle but for
data with high cardinality (like documents with usernames, issue numbers) it can really shine. It also allows
you do ad hoc filtering in a way that time series would not allow as it would require a unique time series
for every possible filter condition & value.

## The GitHub API crawler

So a few weekends ago I had some left over programming energy and spent a few hours hacking together
this [node.js app](https://github.com/torkelo/github-to-es) that uses the GitHub API to crawl all issues & comments which it
then saves as separate documents in Elasticsearch.

It stores them in Elasticsearch with this index mapping:
```javascript
"mappings": {
  "issue": {
    "properties": {
      "title":            { "type": "text"  },
        "state":            { "type": "keyword"  },
        "repo":             { "type": "keyword"  },
        "labels":           { "type": "keyword"  },
        "number":           { "type": "keyword"  },
        "comments":         { "type": "long"  },
        "assignee":         { "type": "keyword"  },
        "user_login":       { "type": "keyword"  },
        "milestone":        { "type": "keyword"  },
        "created_at":       { "type": "date"  },
        "closed_at":        { "type": "date"  },
        "updated_at":       { "type": "date"  },
        "is_pull_request":  { "type": "boolean"  },
    }
  },
    "comment": {
      "properties": {
        "issue":           { "type": "keyword"  },
        "repo":            { "type": "keyword"  },
        "user_login":      { "type": "keyword"  },
        "created_at":      { "type": "date"     },
      }
    }
}
```

There are some more numeric fields being saved for reactions that do not need to be defined
in the index mapping.

### The Dashboards

With the data finally collected I built two dashboards, one focused on [issues](http://play.grafana.org/dashboard/db/github-repo-trends-issues) and another one
focused on [comments](http://play.grafana.org/dashboard/db/github-repo-trends-comments). Both dashboards are templated and allow you to specify which repository
to look at and the granularity (group by time) of the data. You can also add any ad-hoc filter, like
only look at issues created by a specific user or only look at issues with no comments.

![](/assets/img/blog/github_analytics/issue_trends.png)

Check out [the dasboard](http://play.grafana.org/dashboard/db/github-repo-trends-issues) on our play site. I configured the
[github-to-es](https://github.com/torkelo/github-to-es) collector to fetch issues and comments for the main Kubernetes repo, the
main Grafana repo and the Microsoft VS Code editor repository.

The [second dashboard](http://play.grafana.org/dashboard/db/github-repo-trends-comments) shows comment analytics:

![](/assets/img/blog/github_analytics/comment_trends.png)

## Useful how?

So I am not exactly sure how useful this data & dashboards are yet. It was mostly a fun hobby project to see some trends & stats
for issue & comment volume. But this could also be useful data that can help you track things like issue label stats. Stats that could
be used improve categorizing issues and visualizing changes in labeling trends. For example, the graphs could answer questions like:
*How did a concerted effort to improve docs change the trend of issues labeled question*?

## Try it and help me improve it

Check out the GitHub repo [torkelo/github-to-es](https://github.com/torkelo/github-to-es) it has a basic README with instructions
for how to get started.

Once you have the import working you need to add an Elasticsearch data source in Grafana. For index name you specify `github`
and for the *Timestamp* field you specify `created_at`. Then you can import the the two dashboards i published on Grafana.com:

- [grafana.com/dashboards/2244 Issue Analytics](https://grafana.com/dashboards/2244)
- [grafana.com/dashboards/2250 Comments Analytics](https://grafana.com/dashboards/2250)

There are probably many more interesting query's you can do and also the collector could be improved to fetch and store more fields.

There are some limitations for how many issues & comments that can be imported in the initial full import due to the paging limit
in the GitHub API. GitHub API returns a maximum of a 100 issues or comments per "page" and has a page limit of a maximum of 400 pages. This
means that the full import can only handle 40 000 issues and 40 000 comments.


Until next time, keep on graphing!<br>
Torkel Ödegaard<br>
*Grafana Creator & Project Lead<br>*