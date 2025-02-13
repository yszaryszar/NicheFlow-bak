package main

import (
	"log"

	_ "github.com/yszaryszar/NicheFlow/backend/docs" // 导入 swagger 文档
	"github.com/yszaryszar/NicheFlow/backend/internal/app"
)

// @title NicheFlow API
// @version 1.0
// @description NicheFlow 后端 API 文档
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.nicheflow.com/support
// @contact.email support@nicheflow.com

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// @BasePath /api
// @schemes http https

// @securityDefinitions.apikey Bearer
// @in header
// @name Authorization
// @description 请在此输入 Bearer {token}

func main() {
	// 创建应用实例
	application, err := app.New()
	if err != nil {
		log.Fatalf("创建应用实例失败: %v", err)
	}

	// 初始化应用
	if err := application.Initialize(); err != nil {
		log.Fatalf("初始化应用失败: %v", err)
	}

	// 确保应用正常关闭
	defer application.Shutdown()

	// 运行应用
	if err := application.Run(); err != nil {
		log.Fatalf("运行应用失败: %v", err)
	}
}
