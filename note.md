Trouxemos o MSN de volta à vida!

Criamos um chat que traz a experiência nostálgica do MSN utilizando tecnologias modernas. Além de enviar mensagens com a interface clássica, também trouxemos funcionalidades marcantes como envio de winks e o famoso “chamar a atenção” que faz a tela dos amigos tremer. Também integramos o chat com a OpenAI, então dá até para bater papo com o ChatGPT dentro do MSN (enquanto os nossos créditos durarem kkkkk).

O Romulo de Moraes mandou muito bem no frontend, e o Paulo Renato Neves cuidou de toda a infraestrutura e deploy para que todos possam usar o chat. Recomendo que vejam a publicação deles também!

Eu assumi a responsabilidade pela arquitetura do sistema, backend e modelagem do banco de dados. O desafio foi grande: projetar um modelo de dados adequado, implementar interações em tempo real, integrar múltiplos serviços e garantir a entrega de mensagens com segurança e performance. Para isso, utilizei um conjunto de diferentes tecnologias, sempre escolhendo a que melhor se encaixava em cada parte do sistema:

- Backend em NestJS (TypeScript) para cadastro, autenticação e regras de negócio.
- Serviço de WebSocket em Go, garantindo conexão leve e rápida em tempo real.
- Banco de dados PostgreSQL com Prisma ORM para modelagem e migrações eficientes.
- RabbitMQ como Message Broker para comunicação entre serviços.
- Nginx como Load Balancer, permitindo escalar o backend horizontalmente com alta disponibilidade.
- JWT protegendo todas as rotas e garantindo a autenticidade dos usuários.

Cada ação do usuário é validada pela API, salva no banco de dados e propagada via RabbitMQ para o serviço de WebSocket enviar direto ao/s destinatário/s, resultando em um chat seguro e performático. Vou deixar também um diagrama nos comentários para facilitar a visualização da arquitetura do sistema.

Trabalhar nesse projeto foi uma experiência incrível, tanto pelo aprendizado quanto pela chance de reviver uma ferramenta que marcou a minha infância. Esse resultado só foi possível graças à colaboração e dedicação do time, mesmo com a correria do dia a dia, então fica aqui meu agradecimento pela parceria e pela diversão de tirar esse projeto do papel!

🔗 Link para acessar: https://lnkd.in/gBgrZH5w
