package repositories

import (
	"context"
	"time"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FriendRepository interface {
	CreateFriend(ctx context.Context, friend *models.Friend) error
	GetAllFriends(ctx context.Context) ([]*models.Friend, error)
	GetFriendByID(ctx context.Context, id string) (*models.Friend, error)
	GetFriendByEmail(ctx context.Context, email string) (*models.Friend, error)
	UpdateFriend(ctx context.Context, friend *models.Friend) error
	DeleteFriendByID(ctx context.Context, id string) error
}

type friendRepository struct {
	db *gorm.DB
}

func NewFriendRepository(db *gorm.DB) FriendRepository {
	return &friendRepository{
		db: db,
	}
}

func (r *friendRepository) CreateFriend(ctx context.Context, friend *models.Friend) error {
	id, err := uuid.NewRandom()
	if err != nil {
		return err
	}

	friend.ID = id
	friend.CreatedAt = time.Now().UTC()

	if err := r.db.WithContext(ctx).Create(friend).Error; err != nil {
		return err
	}
	return nil
}

func (r *friendRepository) GetAllFriends(ctx context.Context) ([]*models.Friend, error) {
	var friends []*models.Friend
	if err := r.db.WithContext(ctx).Find(&friends).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}

		return nil, err
	}
	return friends, nil
}

func (r *friendRepository) GetFriendByID(ctx context.Context, id string) (*models.Friend, error) {
	var friend models.Friend
	if err := r.db.WithContext(ctx).Where("id = ?", id).First(&friend).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &friend, nil
}

func (r *friendRepository) GetFriendByEmail(ctx context.Context, email string) (*models.Friend, error) {
	var friend models.Friend
	if err := r.db.WithContext(ctx).Where("email = ?", email).First(&friend).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &friend, nil
}

func (r *friendRepository) UpdateFriend(ctx context.Context, friend *models.Friend) error {
	updateData := map[string]any{
		"name":       friend.Name,
		"email":      friend.Email,
		"updated_at": time.Now().UTC(),
	}

	result := r.db.WithContext(ctx).
		Model(&models.Friend{}).
		Where("id = ?", friend.ID).
		Updates(updateData)

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return models.ErrNotFound
	}

	return nil
}

func (r *friendRepository) DeleteFriendByID(ctx context.Context, id string) error {
	result := r.db.WithContext(ctx).
		Where("id = ?", id).
		Delete(&models.Friend{})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return models.ErrFriendNotFound
	}

	return nil
}
