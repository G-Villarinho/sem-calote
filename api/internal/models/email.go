package models

type PaymentRequestData struct {
	FriendName  string
	Value       float64
	Description string
	DueDate     string
	PixKey      string
}
