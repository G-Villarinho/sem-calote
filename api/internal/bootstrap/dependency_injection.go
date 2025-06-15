package bootstrap

import (
	"github.com/g-villarinho/sem-calote/api/internal/clients"
	"github.com/g-villarinho/sem-calote/api/internal/handlers"
	"github.com/g-villarinho/sem-calote/api/internal/handlers/debug"
	"github.com/g-villarinho/sem-calote/api/internal/repositories"
	"github.com/g-villarinho/sem-calote/api/internal/services"
	"github.com/g-villarinho/sem-calote/api/pkgs"
	"go.uber.org/dig"
)

func InitializeDependencyInjection(container *dig.Container) {
	providerDebugHandlers(container)
	providerClients(container)
	provideRepositories(container)
	provideServices(container)
	provideHandlers(container)
}

func providerDebugHandlers(container *dig.Container) {
	pkgs.Provide(container, debug.NewPaymentDebugHandler)
}

func providerClients(container *dig.Container) {
	pkgs.Provide(container, clients.NewMercadoPagoGatewayClient)
}

func provideHandlers(container *dig.Container) {
	pkgs.Provide(container, handlers.NewFamilyHandler)
	pkgs.Provide(container, handlers.NewFriendHandler)
	pkgs.Provide(container, handlers.NewSubscriptionHandler)
}

func provideServices(container *dig.Container) {
	pkgs.Provide(container, services.NewFamilyService)
	pkgs.Provide(container, services.NewFriendService)
	pkgs.Provide(container, services.NewPaymentService)
	pkgs.Provide(container, services.NewSubscriptionService)
}

func provideRepositories(container *dig.Container) {
	pkgs.Provide(container, repositories.NewFamilyRepository)
	pkgs.Provide(container, repositories.NewFriendRepository)
	pkgs.Provide(container, repositories.NewPaymentRepository)
	pkgs.Provide(container, repositories.NewSubscriptionRepository)
}
