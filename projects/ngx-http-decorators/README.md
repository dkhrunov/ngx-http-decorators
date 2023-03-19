# NgxHttpDecorators (NHD)

A library to simplify working with Http requests by describing these requests in a declarative style using decorators.

## Contents

- [Settings](#settings)
- [Creating Api service](#creating-api-service)
  - [GET request](#get-request)
  - [GET request with path parameters](#get-request-with-path-parameters)
  - [Request with Body](#request-with-body)
  - [Request with Query Params](#request-with-query-params)
  - [Request with Headers](#request-with-headers)
  - [Reqeust with HttpContext](#reqeust-with-httpcontext)
  - [Cacheable request](#cacheable-request)
- [Decorators](#decorators)
  - [@HttpController()](#httpcontroller)
  - [@Get()](#get)
  - [@Post()](#post)
  - [@Put()](#put)
  - [@Patch()](#patch)
  - [@Delete()](#delete)
  - [request()](#request)
  - [@Param() and @Params()](#param-and-params)
  - [@Query() and @Queries()](#query-and-queries)
  - [@Body()](#body)
  - [@Header()](#header)
  - [@Context()](#context)
  - [@Cacheable()](#cacheable)
  
## Settings

To get started with __NgxHttpDecorators__, you need to import `NgxHttpDecoratorsModule` into your application's **app/core** module.

Шf most of your requests use the same host (base server url), then it can be specified using the `REFLECTIVE_REQUEST_HOST_URL` InjectionToken as in the example below. 

> It is not necessary to specify this, and further it will be shown how it will be possible to override this property in the Api service.

```typescript
@NgModule({
  imports: [NgxHttpDecoratorsModule],
  providers: [
    {
      provide: NGX_HTTP_DECORATORS_HOST_URL,
      useValue: 'https://test-api.com',
    },
  ],
})
export class AppModule {}
```


## Creating Api service

An api service is a regular service in which methods will make requests to specific endpoints.

It is good practice to separate these services into features. For example, requests for working with users are described in UserService, and requests for working with posts will be described in a separate PostService.

Let's create a service for working with posts:

```typescript
@Injectable({
  providedIn: 'root',
})
@HttpController('/api/posts')
export class PostService {}
```

As you can see, after the standard `@Injectable()` decorator, we specified the `@HttpController()` decorator, the parameter in the form of the string `'/api/posts'` defines the prefix for all requests in this service. You can also pass an object with settings to the `@HttpController({ ... })` decorator.

> The `@HttpController()` decorator is not required to be added to every API service, add this decorator if you really need its functionality.

### GET request

Further in the service, you can describe the requests that this service can perform.

First, let's create a GET request `'/api/posts'` to get all the posts:

```typescript
@Injectable({
  providedIn: 'root',
})
@HttpController('/api/posts')
export class PostService {

  @Get()
  public getAll(): Observable<Post[]> {
    return request(this.getAll);
  }
}
```

> Note that the function returns a `request(this.getAll)` function with a reference to this method, it is necessary for the decorated method to return the `Observable` of the request, as we usually did with HttpClient.
>
> **The given `request(this.decorated Method)` construct is always returned from the declared method.**
>
> because function `request(...)` returns `Observable` we can pipe any RxJs operator. For example, map the value into an array of post Ids:
>
> ```typescript
> @Get()
> public getAll(): Observable<number[]> {
>   return request(this.getAll).pipe(map(x => x.map(p => p.id)));
> }
> ```

### GET request with path parameters

Now let's try to create a GET request `'/api/posts/:postId'` to get a post by Id:

> In order for the `id` argument of the `get` method to be inserted into the url, in the url itself you must specify a unique path parameter using the `:param_name` mask, and in the method arguments add and mark with the decorator `@Param('param_name')` parameter, then the value of this parameter will be substituted in the url each time this method is called.

```typescript
@Injectable({
  providedIn: 'root',
})
@HttpController('/api/posts')
export class PostService {

  @Get()
  public getAll(): Observable<Post[]> {
    return request(this.getAll);
  }

  @Get('/:postId')
  public get(@Param('postId') id: number): Observable<Post> {
    return request(this.get);
  }
}
```

If you call the get method, for example, with the value 11 `this._postService.get(11)`, then we will send a request to such a url - `'/api/posts/11'`;

### Request with Body

Now let's try to make a POST request to `'/api/posts'` to create a new post in the system:

> In order to specify a request Body, you need to decorate the method argument with the `@Body()` decorator.

```typescript
@Injectable({
  providedIn: 'root',
})
@HttpController('/api/posts')
export class PostService {

  @Post()
  public create(@Body() data: CreatePostDto): Observable<Post> {
    return request(this.create);
  }
}
```

### Request with Query Params

Let's create a query in which we want to pass data to the Query Params of the request. 

Create a query filtering posts by certain criteria, which will be passed to the Query Params of the query:

```typescript
@Injectable({
  providedIn: 'root',
})
@HttpController('/api/posts')
export class PostService {
  [...]

  @Get()
  public getWithFilter(
    @Query('published') published?: boolean,
    @Query('author') author?: string,
    @Query('publishDate') publishDate?: string,
  ): Observable<Post[]> {
    return request(this.getWithFilter);
  }
}
```

If there are many parameters, then you can combine them all into an object and pass the Query Params object to the method:

```typescript
@Injectable({
  providedIn: 'root',
})
@HttpController('/api/posts')
export class PostService {
  [...]

  @Get()
  public getWithFilter(
    @Queries() params?: { published?: boolean, author?: string, publishDate?: string },
  ): Observable<Post[]> {
    return request(this.getWithFilter);
  }
}
```

If you call the `getWithFilter()` method, for example, with the object `{ published: true, author: 'Dostoevsky' }` `this._postService.get({ published: true, author: 'Dostoevsky' })`, then we will send request for such url - `'/api/posts?published=true&author=Dostoevsky'`.

### Request with Headers

Now let's try to specify a header for the request:

```typescript
@Injectable({
  providedIn: 'root',
})
@HttpController('/api/posts')
export class PostService {
  [...]

  @Post()
  @Header('X-Custom', 'value')
  public create(@Body() data: CreatePostDto): Observable<Post> {
    return request(this.create);
  }
}
```

You can specify multiple headers:

```typescript
@Injectable({
  providedIn: 'root',
})
@HttpController('/api/posts')
export class PostService {
  [...]

  @Post()
  @Header('X-Custom-1', 'value1')
  @Header('X-Custom-2', 'value2')
  public create(@Body() data: CreatePostDto): Observable<Post> {
    return request(this.create);
  }
}
```

If an entire group of requests in a service requires a specific header, then this can be solved by specifying the `@Header()` decorator on the class, then all methods in this class will have this header:

```typescript
@Injectable({
  providedIn: 'root',
})
@HttpController('/api/posts')
@Header('X-Posts-Header', 'all')
export class PostService {
  // the request will contain only one header - 'X-Posts-Header'
  @Get()
  public getAll(): Observable<Post[]> {
    return request(this.getAll);
  }

  // the request will contain two headers: 'X-Post-Header' and 'X-Custom-2'
  @Get('/:postId')
  @Header('X-Custom-2', 'value2')
  public get(@Param('postId') id: number): Observable<Post> {
    return request(this.get);
  }
}
```

### Reqeust with HttpContext


`HttpContext` is used to store additional metadata that can be accessed from HTTP interceptors.

> [More about HttpContext](https://angular.io/api/common/http/HttpContext).

Add `HttpContext` to the request:

```typescript
const IS_PUBLIC_API = new HttpContextToken<boolean>(() => false);

@Injectable({
  providedIn: 'root',
})
@HttpController('/api/posts')
export class PostService {
  @Get()
  @Context(IS_PUBLIC_API, true)
  public getAll(): Observable<Post[]> {
    return request(this.getAll);
  }
}
```

As with the `@Header()` decorator, we can add multiple HttpContexts per request:

```typescript
const IS_PUBLIC_API = new HttpContextToken<boolean>(() => false);
const IS_CACHE_ENABLED = new HttpContextToken<boolean>(() => false);

@Injectable({
  providedIn: 'root',
})
@HttpController('/api/posts')
export class PostService {
  @Get()
  @Context(IS_PUBLIC_API, true)
  @Context(IS_CACHE_ENABLED, true)
  public getAll(): Observable<Post[]> {
    return request(this.getAll);
  }
}
```

### Cacheable request

To cache the result of a query, we can use the `@Cacheable()` decorator.
The `@Cacheable()` decorator has several options, [more on the @Cacheable() decorator](#cacheable),
but in most cases a decorator with no options is sufficient.

```typescript
@Injectable({
  providedIn: 'root',
})
@HttpController('/api/posts')
export class PostService {

  @Cacheable()
  @Get()
  public getAll(): Observable<Post[]> {
    return request(this.getAll);
  }
}
```

## Decorators

Decorators documentation.

### @HttpController()

The class decorator is used to set some properties for all requests in a given service.

This decorator is optional to add to each api service, add this decorator if you really need its functionality.

The decorator has two variations (overloads):

1. A string is passed as a parameter to the decorator, which specifies the prefix for all requests in this class;

   ```typescript
   @Injectable({
     providedIn: 'root',
   })
   @HttpController('/api/posts')
   export class PostService {}
   ```

2. As a parameter, an object is passed to the decorator, in which you can specify `host` - the server where requests will be sent, and `pathPrefix` - a prefix string for all requests. Both parameters are optional;

   ```typescript
   @Injectable({
     providedIn: 'root',
   })
   @HttpController({
     host: 'https://server.com',
     pathPrefix: '/api/posts',
   })
   export class PostService {}
   ```

### @Request()

Method decorator. Creates an HTTP request. The third argument is the request options optional `options: DecoratedHttpRequestOptions`.

```typescript
@Request(HttpMethod.Get, '/api/posts', options)
public getPosts(): Observable<Post[]> {
  return request(this.getPosts);
}
```

### @Get()

Method decorator. Creates a GET request. The second argument is the request options optional `options: DecoratedHttpRequestOptions`.

```typescript
@Get('/api/posts', options)
public getPosts(): Observable<Post[]> {
  return request(this.getPosts);
}
```

### @Post()

Method decorator. Creates a POST request. The second argument is the request options optional `options: DecoratedHttpRequestOptions`.

```typescript
@Post('/api/posts', options)
public create(): Observable<Post> {
  return request(this.create);
}
```

### @Put()

Method decorator. Creates a PUT request. The second argument is the request options optional `options: DecoratedHttpRequestOptions`.

```typescript
@Put('/api/posts', options)
public create(): Observable<Post> {
  return request(this.create);
}
```

### @Patch()

Method decorator. Creates a PATCH request. The second argument is the request options optional `options: DecoratedHttpRequestOptions`.

```typescript
@Patch('/api/posts', options)
public create(): Observable<Post> {
  return request(this.create);
}
```

### @Delete()

Method decorator. Creates a DELETE request. The second argument is the request options optional `options: DecoratedHttpRequestOptions`.

```typescript
@Delete('/api/posts/:id', options)
public delete(@Param('id') id: number): Observable<void> {
  return request(this.delete);
}
```

### request()

The method decorated with the `@Request()`, `@Get()`, `@Post()`, `@Put`, `@Patch` and `@Delete` decorators must always return `return request(this.decoratedMethod )` so that the decorated method returns the `Observable` of the request.

```typescript
@Get()
public getPosts(): Observable<Post[]> {
  return request(this.getPosts);
}
```

### @Param() и @Params()

Parameter decorator. Specifies the path parameter for the request, replacing the wildcard in the path with the value of the decorated argument.

- @Param('name') - the value is the key for the parameter, and the value is taken from the decorated argument.

  ```typescript
  @Injectable({
    providedIn: 'root',
  })
  @HttpController('/api/posts')
  export class PostService {
    @Get('/:postId')
    public get(@Param('postId') id: number): Observable<Post> {
      return request(this.get);
    }
  }
  ```

- @Params() - the object from the value of the decorative argument maps into the path parameters.

  ```typescript
  @Injectable({
    providedIn: 'root',
  })
  @HttpController('/api/user')
  export class PostService {
    @Get('/:userId/posts/:postId')
    public get(
      @Params() data: { userId: number; postId: number }
    ): Observable<Post> {
      return request(this.get);
    }
  }
  ```

### @Query() и @Queries()

Parameter decorator. Specifies a query parameter, where the value of the decorated argument is the value of the Query Params.

- @Query('name') - the value is the key for the parameter, and the value is taken from the decorated argument.

  ```typescript
  @Injectable({
    providedIn: 'root',
  })
  @HttpController('/api/posts')
  export class PostService {
    [...]

    @Get()
    public getWithFilter(
      @Query('published') published?: boolean,
      @Query('author') author?: string,
      @Query('publishDate') publishDate?: string,
    ): Observable<Post[]> {
      return request(this.getWithFilter);
    }
  }
  ```

- @Queries() - the object from the value of the decorative argument is mapped to Query Params.

  ```typescript
  @Injectable({
    providedIn: 'root',
  })
  @HttpController('/api/posts')
  export class PostService {
    [...]

    @Get()
    public getWithFilter(
      @Queries() params?: { published?: boolean, author?: string, publishDate?: string },
    ): Observable<Post[]> {
      return request(this.getWithFilter);
    }
  }
  ```

### @Body()

Parameter decorator. Specifies the request body with the value of the decorated parameter.

```typescript
@Injectable({
  providedIn: 'root',
})
@HttpController('/api/posts')
export class PostService {
  @Post()
  public create(@Body() data: CreatePostDto): Observable<Post> {
    return request(this.create);
  }
}
```

### @Header()

Method or class decorator. Sets the request header. When applied to a class, this header will be sent with all requests in that class.

```typescript
@Injectable({
  providedIn: 'root',
})
@HttpController('/api/posts')
@Header('X-Posts-Header', 'all')
export class PostService {
  // the request will contain only one header - 'X-Posts-Header'
  @Get()
  public getAll(): Observable<Post[]> {
    return request(this.getAll);
  }

  // the request will contain two headers: 'X-Post-Header' and 'X-Custom-2'
  @Get('/:postId')
  @Header('X-Custom-2', 'value2')
  public get(@Param('postId') id: number): Observable<Post> {
    return request(this.get);
  }
}
```

### @Context()

Method decorator. Specifies the `HttpContext` for the request. `HttpContext` is used to store additional metadata that can be accessed from HTTP Interceptors.

> [More about HttpContext](https://angular.io/api/common/http/HttpContext).


```typescript
const IS_PUBLIC_API = new HttpContextToken<boolean>(() => false);
const IS_CACHE_ENABLED = new HttpContextToken<boolean>(() => false);

@Injectable({
  providedIn: 'root',
})
@HttpController('/api/posts')
export class PostService {
  @Get()
  @Context(IS_PUBLIC_API, true)
  @Context(IS_CACHE_ENABLED, true)
  public getAll(): Observable<Post[]> {
    return request(this.getAll);
  }
}
```

### @Cacheable()

Method decorator. Caching the result of the request, the cached request does not make a repeated http call.

This decorator has optional options:
- __`key`__ - The key under which the cached value will be stored, by default use this `'{{className}}_{{methodName}}_{{args}}'`. Can be just a string or a dynamic function that returns a key.
- __`write`__ - A function that describes how to write http response data to the cache.
- __`read`__ - A function that describes how to read cached data (if it exists) from the cache.
- __`cache`__ - specifies a different cache store for the decorated method, accepts `InjectionToken<ICache>`, before using another cache store, you must provide it to the `NgxHttpDecoratorsModule`.

```typescript
@Injectable({
  providedIn: 'root',
})
@HttpController('/api/posts')
export class PostService {

  @Cacheable({
    key: 'GET_ALL_POSTS',
    write: ({ incoming, existing}) => ({ ...existing, ...incoming })
    read: ({ args, existing }) => {
      if (!existing) {
        // Has no cached values
        return;
      }

      // There may be some logic here to retrieve data from the cache

      return existing;
    }
  })
  @Get()
  public getAll(): Observable<Post[]> {
    return request(this.getAll);
  }
}
```

You can also create your own cache store by creating a service and implementing the `ICache` interface.

Cache service:
```typescript
const MY_HTT_CACHE_TOKEN = new InjectionToken<ICache>(
  'MY_HTT_CACHE_TOKEN',
  {
    providedIn: 'root',
    factory: () => new MyHttpCache()
  }
);

@Injectable()
export class MyHttpCache implements ICache {
  private readonly cache = new Map<string, unknown>();

  public set<T>(key: string, value: T): void {
    this.cache.set(key, value);
  }

  public get<T>(key: string): T | undefined {
    return this.cache.get(key) as T;
  }

  public delete(key: string | string[]): void {
    if (Array.isArray(key)) {
      key.forEach((k) => this.cache.delete(k));
    } else {
      this.cache.delete(key);
    }
  }

  public clear(): void {
    this.cache.clear();
  }
}
```

Used in @Cacheable() decaorator:

```typescript
@Injectable({
  providedIn: 'root',
})
@HttpController('/api/posts')
export class PostService {

  @Cacheable({
    key: 'GET_ALL_POSTS',
    cache: MY_HTT_CACHE_TOKEN
  })
  @Get()
  public getAll(): Observable<Post[]> {
    return request(this.getAll);
  }
}
```

