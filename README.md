# personal-resume

基于原有页面生成的动态个人作品集，使用原生 HTML、CSS 和 JavaScript，无需构建工具即可运行。

## 内容维护

页面内容统一维护在 `content.js` 的 `window.portfolioData` 中：

- `site`：姓名、职位、联系方式和社交链接
- `about`：个人简介和基本信息
- `skills`：技能组、熟练度和标签
- `experience`：工作经历和成果
- `projects`：项目标题、分类、描述、标签和链接

修改配置后刷新页面即可看到更新，不需要改动 `index.html`。`script.js` 负责把配置渲染到页面，并保留滚动动画、项目弹窗、复制联系方式和表单反馈等交互。

项目区会根据 `projects[].tags` 自动生成筛选按钮；页面还支持主题切换、主题偏好记忆和滚动导航高亮。

## 本地预览

直接打开 `index.html`，或在项目目录运行：

```bash
python3 -m http.server 4173
```
