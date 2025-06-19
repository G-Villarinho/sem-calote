package notifications

import (
	"bytes"
	"context"
	"embed"
	"fmt"
	"log"
	"text/template"
	"time"

	"github.com/g-villarinho/sem-calote/api/config"
	"github.com/g-villarinho/sem-calote/api/internal/clients"
	"github.com/g-villarinho/sem-calote/api/internal/models"
)

//go:embed templates/*.html
var emailTemplates embed.FS

const (
	paymentRequest = "templates/payment-request.html"
)

type EmailNotification interface {
	SendPaymentRequestEmail(ctx context.Context, friendName string, friendEmail string, value float64, description string, dueData time.Time) error
}

type emailNotification struct {
	client clients.EmailClient
}

func NewEmailNotification(emailClient clients.EmailClient) EmailNotification {
	return &emailNotification{
		client: emailClient,
	}
}

func (e *emailNotification) SendPaymentRequestEmail(ctx context.Context, friendName string, friendEmail string, value float64, description string, dueData time.Time) error {
	tmpl, err := template.ParseFS(emailTemplates, paymentRequest)
	if err != nil {
		log.Fatalf("parse template: %v", err)
	}

	var htmlBuffer bytes.Buffer
	data := models.PaymentRequestData{
		FriendName:  friendName,
		Value:       fmt.Sprintf("%.2f", value),
		Description: description,
		DueDate:     dueData.Format("02/01/2006"),
		PixKey:      config.Env.Pix.Key,
	}

	if err := tmpl.Execute(&htmlBuffer, data); err != nil {
		return fmt.Errorf("execute template: %w", err)
	}

	bodyText := fmt.Sprintf(
		"Olá %s,\n\n"+
			"Você tem uma solicitação de pagamento pendente no valor de R$ %.2f.\n\n"+
			"Descrição: %s\n"+
			"Data de Vencimento: %s\n\n"+
			"Para facilitar, você pode pagar usando a chave Pix:\n"+
			"Chave Pix: %s\n\n"+
			"Por favor, providencie o pagamento o mais breve possível para evitar mal-entendidos. Agradecemos a sua atenção!\n\n"+
			"Atenciosamente,\n"+
			"Sua equipe de cobrança amigável (ou o remetente)",
		friendName,
		value,
		description,
		data.DueDate,
		data.PixKey,
	)

	email := &clients.SendEmailInput{
		To:       friendEmail,
		Subject:  "Sem calote por favor!",
		BodyText: bodyText,
		BodyHTML: htmlBuffer.String(),
	}

	if err := e.client.SendEmail(ctx, *email); err != nil {
		return fmt.Errorf("send email: %w", err)
	}

	return nil
}
