package schedulers

import (
	"log"
	"time"

	"github.com/robfig/cron/v3"
	"go.uber.org/dig"

	"github.com/g-villarinho/sem-calote/api/internal/notifications"
	"github.com/g-villarinho/sem-calote/api/internal/repositories"
)

func addNotifyPaymentRequestCronJob(cronScheduler *cron.Cron, container *dig.Container) {
	cronScheduler.AddFunc("*/1 * * * *", func() {
		log.Printf("[%s] Iniciando o envio de e-mails de cobrança agendado...\n", time.Now().Format("15:04:05"))

		err := container.Invoke(func(
			emailNotifier notifications.EmailNotification,
			paymentRepo repositories.PaymentRepository,
		) {
		})
		if err != nil {
			log.Printf("Erro em JobEmailCobranca: %v", err)
		}
		log.Printf("[%s] Envio de e-mails de cobrança agendado finalizado.\n", time.Now().Format("15:04:05"))
	})
}
