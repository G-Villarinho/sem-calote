package repositories

import (
	"context"
	"time"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PaymentRepository interface {
	CreatePayment(ctx context.Context, payment *models.Payment) error
	GetAllPaymentsByFriendID(ctx context.Context, friendID uuid.UUID) ([]*models.Payment, error)
	GetAllPaymentsBySubscriptionID(ctx context.Context, subscriptionID uuid.UUID) ([]*models.Payment, error)
	SetPaymentStatus(ctx context.Context, paymentID uuid.UUID, status models.PaymentStatus) error
	SetPaymentPaid(ctx context.Context, paymentID uuid.UUID) error
}

type paymentRepository struct {
	db *gorm.DB
}

func NewPaymentRepository(db *gorm.DB) PaymentRepository {
	return &paymentRepository{
		db: db,
	}
}

func (p *paymentRepository) CreatePayment(ctx context.Context, payment *models.Payment) error {
	id, err := uuid.NewRandom()
	if err != nil {
		return err
	}

	payment.ID = id
	payment.CreatedAt = time.Now().UTC()

	if err := p.db.WithContext(ctx).Create(payment).Error; err != nil {
		return err
	}

	return nil
}

func (p *paymentRepository) GetAllPaymentsByFriendID(ctx context.Context, friendID uuid.UUID) ([]*models.Payment, error) {
	var payments []*models.Payment
	if err := p.db.WithContext(ctx).Where("friend_id = ?", friendID).Find(&payments).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}

		return nil, err
	}
	return payments, nil
}

func (p *paymentRepository) GetAllPaymentsBySubscriptionID(ctx context.Context, subscriptionID uuid.UUID) ([]*models.Payment, error) {
	var payments []*models.Payment
	if err := p.db.WithContext(ctx).Where("subscription_id = ?", subscriptionID).Find(&payments).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}

		return nil, err
	}

	return payments, nil
}

func (p *paymentRepository) SetPaymentStatus(ctx context.Context, paymentID uuid.UUID, status models.PaymentStatus) error {
	updates := map[string]any{
		"status":     status,
		"updated_at": time.Now().UTC(),
	}

	if err := p.db.
		WithContext(ctx).
		Model(&models.Payment{}).
		Where("id = ?", paymentID).
		Updates(updates).Error; err != nil {
		return err
	}

	return nil
}

func (p *paymentRepository) SetPaymentPaid(ctx context.Context, paymentID uuid.UUID) error {
	updates := map[string]any{
		"status":     models.PaymentStatusPaid,
		"paid_at":    time.Now().UTC(),
		"updated_at": time.Now().UTC(),
	}

	if err := p.db.
		WithContext(ctx).
		Model(&models.Payment{}).
		Where("id = ?", paymentID).
		Updates(updates).Error; err != nil {
		return err
	}

	return nil
}
