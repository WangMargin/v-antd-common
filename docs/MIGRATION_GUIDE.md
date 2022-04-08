# 迁移指南

在迁移之前一定要认真阅读 `/docs/CUSTOMIZED.md` 文件, 了解定制化的过程.

## 步骤

1. 将需要迁移的项目最新迭代复制出一份至 `git` 以外的目录;
2. 在需要迁移的项目中新建一个 `<project_name>_pro_refactor` 分支;
3. 删除新分支中项目文件, 将 `SycamoreTemplate` 复制过去;
4. 执行 `yarn install` 命令安装 `node_modules`;
5. 在其他IDE中打开备份的项目代码, 进行比对替换;
6. 删除 `views` 其他无用的代码;

### 比对替换

1. 修改 `package.json`, 修改 `name`, `version` 等字段;
2. 比对依赖包, 使用 `yarn add <module_name>` 进行安装;
3. 将备份的 `views` 迁移, 注意对应 `components` 的迁移;
