package repositories

import (
	"context"

	"github.com/g-villarinho/sem-calote/api/internal/models"
	"gorm.io/gorm"
)

type FriendRepository interface {
	CreateFriend(ctx context.Context, friend *models.Friend) error
	GetAllFriends(ctx context.Context) ([]*models.Friend, error)
	GetFriendByID(ctx context.Context, id string) (*models.Friend, error)
	GetFriendByEmail(ctx context.Context, email string) (*models.Friend, error)
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
