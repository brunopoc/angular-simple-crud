# AngularSimpleCrud

Este projeto é um CRUD (Create, Read, Update, Delete) completo para gerenciamento de gastos pessoais, desenvolvido com Angular 19. Ele permite cadastrar, listar, editar e excluir categorias de gastos, além de cadastrar e listar lançamentos de gastos pessoais. Seguindo as instruções fornecidas em [https://github.com/adelbs/it-api-case](https://github.com/adelbs/it-api-case). O objetivo era criar uma interface de aplicação para interagir com as APIs descritas no repositório, implementando todas as operações CRUD e seguindo as melhores práticas de desenvolvimento.

## Funcionalidades

* **Cadastro de Categorias:** Permite adicionar novas categorias de gastos.
* **Listagem de Categorias:** Exibe todas as categorias cadastradas em uma tabela, com opções de edição e exclusão.
* **Edição de Categorias:** Permite modificar os dados de uma categoria existente.
* **Exclusão de Categorias:** Permite remover uma categoria do sistema.
* **Cadastro de Lançamentos:** Permite adicionar novos lançamentos de gastos pessoais.
* **Listagem de Lançamentos:** Exibe todos os lançamentos cadastrados em uma tabela.
* **Tratamento de Erros:** Implementação de tratamento de erros global e específico para cada funcionalidade.

* **Validações de Campos:** Validação de campos obrigatórios e formatação de dados.
* **Responsividade:** Interface adaptável a diferentes tamanhos de tela.
* **Componentes Compartilhados:** Criação de componentes reutilizáveis (loading, snackbar, header).
* **Serviços:** Organização da lógica de negócio em serviços para melhor manutenção e testabilidade.

## Tecnologias Utilizadas

* **Angular 19:** Framework para desenvolvimento de aplicações web.
* **Angular CLI:** Ferramenta de linha de comando para criação e gerenciamento de projetos Angular.
* **Angular Material:** Biblioteca de componentes de interface de usuário.
* **TypeScript:** Linguagem de programação tipada.
* **Karma e Jasmine:** Frameworks para testes unitários.
* **RxJS:** Biblioteca para programação reativa.

# Setup do Projeto com e sem Docker

Este documento fornece as instruções para rodar a aplicação Angular utilizando Docker.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em seu ambiente:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/) (caso necessário)

1.  **Construa a imagem Docker**
```sh
docker build -t angular-dev .
```

2.  **Execute o container**
```sh
docker run -p 4200:4200 -v $(pwd):/app --rm angular-dev
```
Isso fará com que a aplicação rode na porta 4200.

### Parando o Container:

1.  **Parar o container**
Caso precise parar a execução:
```sh
docker ps
docker stop <CONTAINER_ID>
```

2.  **Remover containers e imagens**
Para remover todos os containers e imagens associadas ao projeto:
```sh
docker system prune -a
```

---
Agora sua aplicação Angular está rodando no Docker! 🚀

## Instalação e Execução Manual

1.  **Instale as dependências:**

    ```bash
    npm install
    ```

2.  **Execute o servidor de desenvolvimento:**

    ```bash
    ng serve
    ```

## Qualidade e Testes

Para executar os testes unitários, utilize o seguinte comando:

```bash
ng test
```

Foram implementados testes unitários para os serviços e componentes principais, utilizando Karma e Jasmine. A cobertura de testes é de [X%]. Uma evolução em termos de qualidade é contar com apoio de ferramentas que permita testes end-to-end utilizando de base ferramentas como o [Cypress](https://docs.cypress.io/app/end-to-end-testing/writing-your-first-end-to-end-test).

Outra sugestão a ser estudada como evolução é a possíbilidade de documentar os componentes da aplicação em um sistema como o [Storybook](https://storybook.js.org/tutorials/intro-to-storybook/angular/pt/get-started)

## Estrutura do Projeto

* **`src/app`:** Contém o código fonte principal da aplicação.
    * **`categorias`:** Módulo para gerenciamento de categorias.
    * **`gastos-pessoais`:** Módulo para gerenciamento de gastos pessoais.
    * **`home`:** Componente da página inicial.
    * **`models`:** Define os modelos de dados da aplicação.
    * **`services`:** Contém os serviços da aplicação, responsáveis pela lógica de negócio.
    * **`shared`:** Contém componentes e serviços compartilhados entre os módulos.

## Infraestrutura sugerida

O padrão sugerido de infraestrutura para o projeto é o apresentado pela AWS como padrão para projetos SPA

![Arquitetura AWS para SPAs](https://docs.aws.amazon.com/pt_br/prescriptive-guidance/latest/patterns/images/pattern-img/970a9d13-e8a2-44ac-aca5-a066e4be60e8/images/96061e05-8ac8-446e-b1da-baa6fc1cc7b6.png "Infraestrutura para SPA na cloud")

Como uma sugestão de aplicação dessa infraestrutura o repositório possui um workflow de deploy para o Github Action e um arquivo terraforms que pode ser executado pela pipeline afim de criar a infraestrutura (pendente validação).

Para mais informações, segue a documentação: [Implante um aplicativo de página única baseado em React no Amazon S3 e CloudFront](https://docs.aws.amazon.com/pt_br/prescriptive-guidance/latest/patterns/deploy-a-react-based-single-page-application-to-amazon-s3-and-cloudfront.html).

## Segurança

Estamos garantindo que infraestrutura forneça páginas com os cabeçalhos que reforcem a segurança, algumas das configurações aplicadas são:

- CSP → Restringe fontes externas de scripts, estilos e objetos.
- strict transport security → Obriga HTTPS por 2 anos.
- x-frame-options → Evita Clickjacking.
- x-content-type-options → Bloqueia ataque de MIME-sniffing.
- referrer-policy → Protege a privacidade do usuário.
- permissions-policy → Restringe acesso a recursos como câmera e microfone.

Para aprimorar a segurança do sistema, recomenda-se a utilização de ferramentas que realizam testes de vulnerabilidade com base em bancos de dados como o National Vulnerability Database (NVD). O Qualys é uma excelente opção para essa finalidade.