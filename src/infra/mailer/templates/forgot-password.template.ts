type ForgotPasswordProps = {
  url: string
  name: string
}

export const forgotPasswordTemplate = ({ url, name }: ForgotPasswordProps) => {
  return `
<html>
<head>
<title>Nova senha – Haribo Race 🏁</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
<body bgcolor="#efefef" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;0,1000;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900;1,1000&display=swap" rel="stylesheet">
<!-- Save for Web Slices (HAR003--HTML--Disparos-portal-(Reset-de-senha-02)--23-01-25) -->
<table id="Tabela_01" width="600" height="" border="0" cellpadding="0" cellspacing="0" align="center" bgcolor=" #0156A6">
	<tr>
		<td>
			<img src="https://molla-public.s3.sa-east-1.amazonaws.com/Haribo/HAR003--Emkts--Haribo-Race-Disparos-Portal--23-01-25/HAR003--Emkt--Header-01.png" width="100%" height="" style="max-width: 600px" alt="Header"></td>
	</tr>
	<tr>
		<td>&nbsp;</td>
	</tr>
	<tr>
		<td align="center">
			<table align="center" width="90%">
				<tr>
					<td align="center">
						<p style="font-family: 'Nunito', sans-serif; font-size: 36px; color: #ffe900; font-weight: 900">Olá, ${name}</p>
					</td>
				</tr>
				<tr>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td align="center">
						<p style="font-family: 'Nunito', sans-serif; font-size: 24px; color: #fff; font-weight: 600; letter-spacing: 1px">Recebemos sua solicitação e vamos<br><span style="font-size: 30px; line-height: 50px; text-decoration: underline">TE AJUDAR!</span></p>
					</td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td align="center" bgcolor=" #0156A6">
			<img src="https://molla-public.s3.sa-east-1.amazonaws.com/Haribo/HAR003--Emkts--Haribo-Race-Disparos-Portal--23-01-25/HAR003--Emkt--banner-Reset-de-senha-01.png" width="100%" height="" style="max-width: 600px" alt="banner"></td>
	</tr>
	<tr>
		<td align="center" bgcolor="#0767b1">
			<table align="center" width="90%">
				<tr>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td align="center">
						<p style="font-family: 'Nunito', sans-serif; font-size: 20px; color: #fff; font-weight: 500; line-height: 32px; letter-spacing: 1px"><em>Clique no botão abaixo para redefinir a sua<br>senha na plataforma Haribo Corrida de Ouro:</em></p>
					</td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td align="center"><a href="${url}" target="_blank"><img src="https://molla-public.s3.sa-east-1.amazonaws.com/Haribo/HAR003--Emkts--Haribo-Race-Disparos-Portal--23-01-25/HAR003--Emkt--Reset-de-senha-opc%CC%A7-cta.png" width="100%" height="" style="max-width: 600px" alt="botão: cadastrar nova senha"></a></td>
	</tr>
	<tr>
		<td align="center">
			<table align="center" width="90%">
				<tr>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td align="center">
						<p style="font-family: 'Nunito', sans-serif; font-size: 20px; color: #fff; font-weight: 500; line-height: 30px">Caso não tenha realizado esta solicitação,<br>favor desconsiderar este e-mail.</p>
					</td>
				</tr>
				<tr>
					<td>&nbsp;</td>
				</tr>
				<tr>
					<td align="center">
						<p style="font-family: 'Nunito', sans-serif; font-size: 15px; color: #fff; font-weight: 400; line-height: 30px"><em> Essa é uma mensagem automática e você não precisa respondê-la.</em></p>
					</td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td>&nbsp;</td>
	</tr>
	<tr>
		<td align="center">
			<img src="https://molla-public.s3.sa-east-1.amazonaws.com/Haribo/HAR003--Emkts--Haribo-Race-Disparos-Portal--23-01-25/HAR003--Emkt--footer-01.png" width="100%" height="" style="max-width: 600px" alt="footer"></td>
	</tr>
</table>
<!-- End Save for Web Slices -->
</body>
</html>
`
}
