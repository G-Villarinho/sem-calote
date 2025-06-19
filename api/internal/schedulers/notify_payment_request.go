package schedulers

import (
	"context"
	"fmt"
	"log/slog"
	"sync"
	"time"

	"github.com/robfig/cron/v3"
	"go.uber.org/dig"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/g-villarinho/sem-calote/api/internal/notifications"
	"github.com/g-villarinho/sem-calote/api/internal/repositories"
	"github.com/g-villarinho/sem-calote/api/internal/services"
)

const (
	cronSpec = "*/2 * * * *"
)

func addNotifyPaymentRequestCronJob(cronScheduler *cron.Cron, container *dig.Container) {
	cronScheduler.AddFunc(cronSpec, func() {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
		defer cancel()

		slog.Info("Starting scheduled payment request email delivery...")

		err := container.Invoke(func(
			emailNotifier notifications.EmailNotification,
			paymentService services.PaymentService,
			subscriptionRepository repositories.SubscriptionRepository,
		) {
			processPaymentRequests(ctx, emailNotifier, paymentService, subscriptionRepository)
		})
		if err != nil {
			slog.Error("Error in PaymentRequestEmailJob during invoke", "error", err)
		}
		slog.Info("Scheduled payment request email delivery finished.")
	})
}

func processPaymentRequests(
	ctx context.Context,
	emailNotifier notifications.EmailNotification,
	paymentService services.PaymentService,
	subscriptionRepository repositories.SubscriptionRepository,
) {
	subscriptions, err := subscriptionRepository.GetAllSubscriptions(ctx, true)
	if err != nil {
		slog.Error("Error fetching subscriptions", "error", err)
		return
	}

	if len(subscriptions) == 0 {
		slog.Info("No subscriptions found to process.")
		return
	}

	var wg sync.WaitGroup
	for _, subscription := range subscriptions {
		wg.Add(1)
		go func(currentSubscription models.Subscription) {
			defer wg.Done()
			processSubscriptionPayments(ctx, currentSubscription, emailNotifier, paymentService)
		}(subscription)
	}
	wg.Wait()
}

func processSubscriptionPayments(
	ctx context.Context,
	subscription models.Subscription,
	emailNotifier notifications.EmailNotification,
	paymentService services.PaymentService,
) {
	familyCount := len(subscription.Friends) + 1

	if familyCount == 0 {
		return
	}

	valuePerFriend := float64(subscription.TotalPriceInCents) / float64(familyCount) / 100.0
	dueDate := time.Now().Add(72 * time.Hour)

	var wg sync.WaitGroup
	for _, friend := range subscription.Friends {
		wg.Add(1)
		go func(currentFriend models.Friend) {
			defer wg.Done()
			goroutineCtx, goroutineCancel := context.WithCancel(ctx)
			defer goroutineCancel()

			createPaymentAndSendEmail(goroutineCtx, subscription, currentFriend, valuePerFriend, dueDate, emailNotifier, paymentService)
		}(*friend)
	}
	wg.Wait()
}

func createPaymentAndSendEmail(
	ctx context.Context,
	subscription models.Subscription,
	friend models.Friend,
	valuePerFriend float64,
	dueDate time.Time,
	emailNotifier notifications.EmailNotification,
	paymentService services.PaymentService,
) {
	createPaymentInput := models.CreatePaymentInput{
		SubscriptionID: subscription.ID,
		PriceInCents:   subscription.TotalPriceInCents / int64(len(subscription.Friends)),
		FriendID:       friend.ID,
	}

	_, err := paymentService.CreatePayment(ctx, createPaymentInput)
	if err != nil {
		slog.Error("Error creating payment for friend",
			"error", err,
			"friend_id", friend.ID,
			"subscription_id", subscription.ID,
		)
		return
	}

	emailDescription := fmt.Sprintf("Regarding subscription '%s'.", subscription.Name)

	sendEmailCtx, sendEmailCancel := context.WithTimeout(ctx, 10*time.Second)
	defer sendEmailCancel()

	err = emailNotifier.SendPaymentRequestEmail(
		sendEmailCtx,
		friend.Name,
		friend.Email,
		valuePerFriend,
		emailDescription,
		dueDate,
	)

	if err != nil {
		slog.Error("Error sending email",
			"error", err,
			"friend_id", friend.ID,
			"subscription_id", subscription.ID,
		)
	} else {
		slog.Info("Payment request email sent successfully",
			"friend_id", friend.ID,
			"subscription_id", subscription.ID,
		)
	}
}
