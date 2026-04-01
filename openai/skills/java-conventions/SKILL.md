---
name: java-conventions
description: Java 编码规范和最佳实践
tags: java, style, conventions
---

# Java Conventions

## Naming
- 类名: PascalCase (UserService)
- 方法名: camelCase (getUserById)
- 常量: UPPER_SNAKE_CASE (MAX_RETRY_COUNT)

## Error Handling
- 使用自定义异常而非通用 Exception
- 在 Service 层捕获, 在 Controller 层转换为 HTTP 响应