import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// 获取环境配置项目
import { environment } from './../../environments/environment';
import { storage } from '@app/utils';
import { X_USER_TOKEN } from '../config';
import { Router } from '@angular/router';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { LoggerService } from '@app/services/tools/logger/logger.service';

@Injectable()
export class ParamInterceptor implements HttpInterceptor {
  private baseUrl: string;
  constructor (
    private readonly router: Router,
    private readonly modalService: NzModalService,
    private readonly loggerService: LoggerService,
    private readonly message: NzMessageService,
  ) {
    this.baseUrl = environment.baseUrl;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // 处理url地址的问题
    const url = this._url(req.url);
    if (this.ignoreToken(req.url)) {
      req = req.clone({
        url,
        headers: req.headers
          .set('Content-Type', 'application/json; charset=UTF-8')
      });
    } else {
      // 如果本地获取不到token就重定向到登录页面
      if (!storage.getItem(X_USER_TOKEN)) {
        console.log('没token跳转到登录页面');
        this.router.navigateByUrl('/login');
      } else {
        // 设置请求头
        req = req.clone({
          url,
          headers: req.headers
            .set(X_USER_TOKEN, JSON.parse(storage.getItem(X_USER_TOKEN)))
        });
      }
    }

    return next.handle(req).pipe(
      tap(
        (event: any) => {
          if (event instanceof HttpResponse) {
            const status = event.status;
            if (status >= 200 && status < 300) {
              const body = event.body;
              const currentUrl = event.url;
              const { code, message } = body;
              if (!Object.is(code, 0)) {
                // token失效跳转到登录页面
                if (Object.is(code, 10042)) {
                  this.message.create('warning', message);
                  setTimeout(() => {
                    this.router.navigateByUrl('/login');
                  });
                } else {
                  this.loggerService.error(currentUrl, '当前接口请求错误');
                }
              }
            }
          }
        },
        error => {
          // token过期 服务器错误等处理
          const status = error.status;
          if (status >= 500) {
            this.modalService.error({
              nzTitle: '<h4>错误提示</h4>',
              nzContent: '服务器端错误,请求重新刷新页面',
              nzOnOk: () => window.location.reload(),
            });
          } else if (status === 401) {
            this.modalService.confirm({
              nzTitle: '<h4>权限提示</h4>',
              nzContent: '<b>当前操作没权限,是否跳转到主页</b>',
              nzOnOk: () => this.router.navigateByUrl('/home')
            });
          } else if (status === 429) {
            this.modalService.warning({
              nzTitle: '访问受限提示',
              nzContent: '你访问过于频繁,等会访问',
            });
          }
        }
      )
    );
  }

  /**
   * 忽视token的方法
   * @param url 当前的url地址
   */
  public ignoreToken(url: string): boolean {
    const ignoreToken = environment.ignoreToken;
    let currentUrl = url.split('/').filter(item => Boolean(item)).join('/');
    currentUrl = currentUrl.lastIndexOf('?') != -1 ? currentUrl.substring(0, currentUrl.lastIndexOf('?')) : currentUrl;
    if (ignoreToken.includes(currentUrl)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-21 20:40:48
   * @LastEditors: 水痕
   * @Description: 封装一个处理url地址的方法
   * @param url{String}
   * @return:
   */
  private _url(url: string): string {
    if (url.startsWith('http') || url.startsWith('https')) {
      return url;
    } else {
      /**
       * 处理url拼接问题
       * 1.如果baseUrl带了/结尾,url也带了/开头就截取一个
       * 2.如果baseUrl不带/结尾,url也不带/结尾就加一个
       * 3.如果都不是就直接返回
       */
      if (/.*?\/$/.test(this.baseUrl) && /^\/.*/.test(url)) {
        return `${this.baseUrl}${url.substring(1, url.length)}`;
      } else if (!/.*?\/$/.test(this.baseUrl) && !/^\/.*/.test(url)) {
        return `${this.baseUrl}/${url}`;
      } else {
        return `${this.baseUrl}${url}`;
      }
    }
  }
}
