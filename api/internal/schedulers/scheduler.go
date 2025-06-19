package schedulers

import (
	"github.com/robfig/cron/v3"
	"go.uber.org/dig"
)

func StartCronJobs(container *dig.Container) {
	cronScheduler := cron.New()

	addNotifyPaymentRequestCronJob(cronScheduler, container)

	cronScheduler.Start()
}
