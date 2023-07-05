# Current Performance Report

Tests were ran on a 2021 M1 MacBook Pro with 16 GB of RAM.
They assumed that we were querying a deterministic worker id with available shifts given our use case.

For simplicity sake we only conducted a simple e2e performance load test using [hey](https://github.com/rakyll/hey).

This is the command used:

`hey -n 10000 -c 100 http://localhost:5006/shifts/available/:workerId`

This will send 10000 requests (-n 10000) to our endpoint with a concurrency level of 100 (-c 100), which means that hey will make 100 requests at the same time.

### Scenario #1:

Fresh start, Redis cache is enabled but empty.

```bash
Summary:
  Total:	2.5266 secs
  Slowest:	0.1466 secs
  Fastest:	0.0019 secs
  Average:	0.0251 secs
  Requests/sec:	3957.8483

  Total data:	14950000 bytes
  Size/request:	1495 bytes

Response time histogram:
  0.002 [1]	|
  0.016 [127]	|■
  0.031 [9219]	|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  0.045 [528]	|■■
  0.060 [22]	|
  0.074 [3]	|
  0.089 [0]	|
  0.103 [0]	|
  0.118 [0]	|
  0.132 [56]	|
  0.147 [44]	|


Latency distribution:
  10% in 0.0194 secs
  25% in 0.0211 secs
  50% in 0.0236 secs
  75% in 0.0265 secs
  90% in 0.0294 secs
  95% in 0.0316 secs
  99% in 0.1185 secs

Details (average, fastest, slowest):
  DNS+dialup:	0.0001 secs, 0.0019 secs, 0.1466 secs
  DNS-lookup:	0.0000 secs, 0.0000 secs, 0.0027 secs
  req write:	0.0000 secs, 0.0000 secs, 0.0040 secs
  resp wait:	0.0250 secs, 0.0019 secs, 0.1400 secs
  resp read:	0.0000 secs, 0.0000 secs, 0.0026 secs

Status code distribution:
  [200]	10000 responses
```

### Scenario #2

Tested after Scenario #1, Redis cache is enabled and populated.

```bash
Summary:
  Total:	2.1794 secs
  Slowest:	0.0756 secs
  Fastest:	0.0078 secs
  Average:	0.0217 secs
  Requests/sec:	4588.5101

  Total data:	15410000 bytes
  Size/request:	1541 bytes

Response time histogram:
  0.008 [1]	|
  0.015 [21]	|
  0.021 [5820]	|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  0.028 [3765]	|■■■■■■■■■■■■■■■■■■■■■■■■■■
  0.035 [274]	|■■
  0.042 [19]	|
  0.048 [0]	|
  0.055 [14]	|
  0.062 [20]	|
  0.069 [38]	|
  0.076 [28]	|


Latency distribution:
  10% in 0.0182 secs
  25% in 0.0194 secs
  50% in 0.0209 secs
  75% in 0.0227 secs
  90% in 0.0251 secs
  95% in 0.0271 secs
  99% in 0.0531 secs

Details (average, fastest, slowest):
  DNS+dialup:	0.0001 secs, 0.0078 secs, 0.0756 secs
  DNS-lookup:	0.0000 secs, 0.0000 secs, 0.0047 secs
  req write:	0.0000 secs, 0.0000 secs, 0.0024 secs
  resp wait:	0.0216 secs, 0.0078 secs, 0.0658 secs
  resp read:	0.0000 secs, 0.0000 secs, 0.0039 secs

Status code distribution:
  [200]	10000 responses
```

# Scenario #3

Fresh start, Redis cache is disabled.

```bash
Summary:
  Total:	6.7227 secs
  Slowest:	0.1378 secs
  Fastest:	0.0050 secs
  Average:	0.0669 secs
  Requests/sec:	1487.5062

  Total data:	14980000 bytes
  Size/request:	1498 bytes

Response time histogram:
  0.005 [1]	|
  0.018 [7]	|
  0.032 [18]	|
  0.045 [51]	|
  0.058 [730]	|■■■■
  0.071 [6955]	|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  0.085 [1843]	|■■■■■■■■■■■
  0.098 [291]	|■■
  0.111 [4]	|
  0.124 [30]	|
  0.138 [70]	|


Latency distribution:
  10% in 0.0586 secs
  25% in 0.0614 secs
  50% in 0.0649 secs
  75% in 0.0705 secs
  90% in 0.0779 secs
  95% in 0.0830 secs
  99% in 0.1141 secs

Details (average, fastest, slowest):
  DNS+dialup:	0.0001 secs, 0.0050 secs, 0.1378 secs
  DNS-lookup:	0.0000 secs, 0.0000 secs, 0.0047 secs
  req write:	0.0000 secs, 0.0000 secs, 0.0043 secs
  resp wait:	0.0668 secs, 0.0050 secs, 0.1279 secs
  resp read:	0.0000 secs, 0.0000 secs, 0.0052 secs

Status code distribution:
  [200]	10000 responses
```

# Current Performance Improvements

1. **Pagination**: [Cursor-based pagination](https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination) has been implemented to handle large amounts of data [more efficiently](https://www.prisma.io/docs/concepts/components/prisma-client/pagination#-pros-of-cursor-based-pagination) than traditional offset-based pagination. Cursor pagination keeps track of the current position in the list of results, reducing the load on the database by avoiding offset skipping. It can be specified using a cursor query parameter, such as `/shifts/available/1?cursor=123`, providing an "infinite scroll" user experience for when we implement the UI. With this strategy, we ensure that the server only processes the requested amount of records after a specific point.

2. **Caching**: Caching is currently implemented with [Redis](https://redis.io/), an in-memory data structure store renowned for its high-speed performance and versatility. Redis has been integrated into our docker-compose file for convenient usage and setup.

   We're currently caching two queried entities:

   - **Worker with documents**: Using the worker `id` as key: `worker:${workerId}`;
   - **Facilities available for worker**: Using the worker `id` as key: `facilities:worker:${workerId}`.
   - **Available shifts for a worker**: Using the worker `id` and the queried `cursor` as key: `shifts:${workerId}:${cursor || '0'}`.

# Future Performance Improvements

1. **Database Indexing**: Further performance enhancements could be achieved through effective database indexing. Specifically, we could add indexes to frequently queried columns such as:

   - **Shift**:
     - `worker_id`
     - `facility_id`
     - `profession`
   - **FacilityRequirement**:
     - `document_id`
     - `facility_id`

   This needs some discovery, but assuming our application performs a lot of read operations, indexes could provide significant performance improvements. However, it's worth noting that while indexing can significantly speed up read operations, it can also slow down write operations as each index needs to be updated with every data modification. Therefore, a balance should be sought based on the specific usage patterns of the application.

2. **Better, Smarter Caching**: We could also explore more sophisticated caching techniques to further reduce database load. For example, entities like facilities that might not change frequently could be kept in cache persistently, and we could consider implementing a Least Recently Used (LRU) cache eviction policy to manage memory usage effectively. Additionally, we need to implement a robust strategy for cache invalidation to ensure that the cached data remains consistent with the database (invalidate cache for impacted entities on write).

3. **Use a More Performant Programming Language**: While TypeScript is popular for its developer-friendly syntax and strong community support, we could consider using a more performant programming language such as Rust, Zig, or Go. This could potentially provide significant performance gains while using less resources, but it's important to balance this with considerations about the increased complexity of the codebase, the pool of available developers, and the potential impact on development speed.
