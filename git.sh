#!/bin/bash

# 确保脚本在任何命令失败时立即退出
set -e 

# 脚本开始，确保在功能分支上运行
current_branch=$(git branch --show-current)
develop_branch="develop"
main_branch="main"

# 同步最新 develop
echo "正在获取远程 develop 分支的最新代码..."
git fetch origin $develop_branch

echo "正在将当前分支变基到最新的 develop..."
git rebase origin/$develop_branch

# 检查 rebase 是否成功
if [[ $? -ne 0 ]]; then
    echo "变基失败，请解决冲突后重试。"
    exit 1
fi

# 推送到 develop 分支
echo "正在将当前分支推送到 develop 分支..."
git push origin HEAD:$develop_branch --force-with-lease

# 切换到 main 并合并 develop
echo "正在切换到 main 分支..."
git checkout $main_branch

echo "正在将 develop 分支的最新更改合并到 main 分支..."
git merge origin/$develop_branch --ff-only

# 检查合并是否成功
if [[ $? -ne 0 ]]; then
    echo "合并到 main 分支失败。"
    exit 1
fi

echo "正在将更改推送到远程 main 分支..."
git push origin $main_branch

# 切换回 develop 分支并同步
echo "切换回 develop 分支并同步远程更改..."
git checkout $develop_branch
git pull origin $develop_branch

# 清理分支（可选）
read -p "是否要删除本地功能分支 '$current_branch'? (y/[n]): " delete_branch
delete_branch=${delete_branch:-y} # 默认值设为 'y'
if [[ "$delete_branch" == "y" || "$delete_branch" == "Y" ]]; then
    echo "正在删除本地功能分支..."
    git branch -d $current_branch
else
    echo "跳过分支删除。"
fi

echo "脚本执行完毕。"
