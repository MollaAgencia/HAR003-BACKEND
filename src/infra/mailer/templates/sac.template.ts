type SacTemplateProps = {
  name: string
  email: string
  subject: string
  message: string
  telephone: string
}

export const SacTemplate = (props: SacTemplateProps) => {
  return `
    <html>
      <body>
        <h1>Olá, ${props.name} enviou uma mensagem para o SAC</h1>
        <p>Detalhes da mensagem
          <ul>
            <li>Nome: ${props.name}</li>
            <li>Email: ${props.email}</li>
            <li>Telefone: ${props.telephone}</li>
            <li>Assunto: ${props.subject}</li>
            <li>Mensagem: ${props.message}</li>
          </ul>
        </p>
      </body>
    </html>
  `
}
