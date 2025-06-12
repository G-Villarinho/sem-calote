package billing

import "time"

func CalculateNextDate(currentTime time.Time, dueDay int) time.Time {
	now := currentTime.UTC()

	nextBillingDate := time.Date(now.Year(), now.Month(), dueDay, 0, 0, 0, 0, time.UTC)

	if nextBillingDate.Before(now) {
		nextBillingDate = nextBillingDate.AddDate(0, 1, 0)
	}

	return nextBillingDate
}

func CalculateDaysLeft(nextBillingDate time.Time) int {
	now := time.Now().UTC()
	daysLeft := int(nextBillingDate.Sub(now).Hours() / 24)

	if daysLeft < 0 {
		return 0
	}

	return daysLeft
}
