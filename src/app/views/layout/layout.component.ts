import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from '@app/store/store.module';
import { getCurrentCollapsed } from '@app/store/selectors';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MenusService } from '@app/services/menus/menus.service';
import { formatMenus } from '@app/utils';
import { ObjectType } from '@app/types';
import { CommonService } from '@app/services/tools/common/common.service';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  isCollapsed: boolean = false;
  menusList: ObjectType[];
  sourceMenus: ObjectType[];
  constructor (
    private router: Router,
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>,
    private readonly menusService: MenusService,
    private commentService: CommonService,
  ) { }

  ngOnInit() {
    this.store$.pipe(select('isCollapsed' as any), select(getCurrentCollapsed)).subscribe(item => {
      this.isCollapsed = item;
    });
    this.initMenu();
    this.setTitle();
  }

  // 页面点击菜单按钮
  selectedMenu(menu: any): void {
    this.router
      // 第三个参数是携带在url地址上的附加属性?name=heh&age=20
      // .navigate([tabMenu.url], { queryParams: { refresh } })
      .navigate([menu.url])
      .then(() => {
        console.log('跳转成功了', menu);
      })
      .catch(error => {
        console.log(error);
        this.router.navigate(['/home']);
      });
  }

  // 获取菜单
  initMenu() {
    this.menusService.menusApi$().subscribe(data => {
      const { code, message, result } = data;
      if (Object.is(code, 0)) {
        this.sourceMenus = result;
        this.menusList = formatMenus(result, 'orderSeq');
      } else {
        console.log(message);
      }
    });
  }

  // 设置标题
  setTitle(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => {
        return route.data;
      }),
    ).subscribe(route => {
      // 设置标题
      window.document.title = route.title || 'approlval-web';
    });
  }
}
