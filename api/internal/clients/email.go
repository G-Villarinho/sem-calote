package clients

import "context"

type EmailClient interface {
	SendEmail(ctx context.Context, email SendEmailInput) error
}

type SendEmailInput struct {
	To       string `json:"to"`
	Subject  string `json:"subject"`
	BodyText string `json:"body_text"`
	BodyHTML string `json:"body_html"`
}
