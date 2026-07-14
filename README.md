<h1 align="center">>_ ROOT_ACCESS (NÓ TERMINAL)</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-18-DD0031?style=for-the-badge&logo=angular" alt="Angular 18">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex" alt="RxJS">
  <img src="https://img.shields.io/badge/Architecture-Data--Driven-success?style=for-the-badge" alt="Data-Driven">
</p>

<p align="center">
  <strong>Uma aventura narrativa cyberpunk operada inteiramente via linha de comandos no browser. Hackeia a rede, ganha influência e expõe a OmniCorp.</strong>
</p>

---

## 📖 A Missão (O Jogo)

O ano é irrelevante. A **OmniCorp** domina o mundo através de um monopólio de dados corporativos. Foste recrutado na *darknet* por um contacto misterioso conhecido apenas como **Oráculo**.

O teu objetivo não é executar um "hack" de força bruta. Estás a iniciar uma operação clandestina para expor a corporação, e o teu alvo final é o **Dossier Fantasma** — um ficheiro altamente encriptado cuja chave foi dividida em 5 fragmentos, espalhados pelas mentes dos administradores da rede (Aria, Jaxx, Kael, Cygnus e Vex).

### ⚙️ Loop de Gameplay
1. **Engenharia Social:** Usa comandos de diálogo para ganhar confiança e influência (80%+) sobre os contactos da rede.
2. **Progressão:** Reporta o teu progresso ao Oráculo para desbloquear novas fases da operação.
3. **Recolha de Dados:** Extrai os fragmentos da chave dos administradores.
4. **O Confronto Final:** Eleva a influência média de toda a rede acima dos 80% para aceder ao poderoso mainframe **Nexus** e entregar a chave completa.
5. **Sobrevivência:** Cuidado com o **ICE** (sistemas de contramedidas), que reage dinamicamente às tuas ações na rede.

---

## 🧠 Arquitetura e Engenharia (O Verdadeiro Desafio)

Apesar de a interface ser um terminal minimalista, não se trata de um simples script em Vanilla JS. O **ROOT_ACCESS** é uma aplicação Single-Page (SPA) complexa, construída em **Angular 18**.

O maior desafio de engenharia não foi a UI do terminal (histórico de teclas ou scroll), mas sim a **orquestração do estado do jogo**. O projeto implementa uma robusta **Máquina de Estados Narrativa** totalmente orientada a dados (*data-driven*) e sem backend.

### Destaques Técnicos:
* **Estado Reativo (RxJS):** Uso avançado de `BehaviorSubject` e *observables* para sincronizar em tempo real as fases do jogo, o sistema de influência, as reações do ICE e ações pendentes (ex: `pending_action` aguardando um alvo de um *rootkit*).
* **Arquitetura Data-Driven:** Todo o conteúdo narrativo (fases, diálogos ramificados, itens, personagens e idiomas) é injetado via ficheiros JSON locais, isolando completamente a lógica (TypeScript) da base de dados narrativa.
* **Sistema de i18n Dinâmico:** Suporte nativo para pt-BR e en-US. O motor de jogo é inteligente o suficiente para processar comandos traduzidos pelo utilizador (ex: digitar `falar` ou `talk`) e mapeá-los em tempo real para chaves de execução fixas na lógica interna.
* **Persistência de Dados Segura:** Sistema customizado de *Save/Load* que exporta o estado do jogo para um ficheiro `.json` encriptado, além de gerir *autosaves* fluídos através da API de `localStorage`.
* **Motor de Áudio Customizado:** Um `SoundService` injetável que reage aos eventos RxJS para criar uma atmosfera imersiva sem bloquear a *thread* principal.

---

## 💻 Interface de Comandos (CLI)

O terminal aceita dezenas de instruções contextuais. Alguns comandos vitais para a operação:

| Comando | Descrição |
| :--- | :--- |
| `falar oraculo` | Inicia o diálogo com o teu contacto (receber diretivas de missão). |
| `online` | Lista os nós/contactos visíveis e a tua atual percentagem de confiança com eles. |
| `usar ping_sweep` | Executa software de mapeamento de rede (+5% de influência, limitado por setor). |
| `responder [1-4]` | Escolhe uma opção durante um diálogo ramificado. |
| `chaves` | Exibe o estado atual da desencriptação e os fragmentos do Dossier Fantasma adquiridos. |
| `inventario` | Lista os softwares e ferramentas na tua posse. |
| `salvar` / `carregar` | Persiste ou recupera a tua sessão de forma encriptada. |
| `ajuda` | Lista a documentação dos comandos disponíveis no sistema. |

---

## 🚀 Como Compilar e Executar Localmente

### Pré-requisitos
* [Node.js](https://nodejs.org/) (Versão LTS)
* [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)

### Instalação
1. Clona o repositório para a tua máquina:
   `git clone https://github.com/RodrigoRibeiroNU/root-access.git`
2. Acede à diretoria do projeto:
   `cd root-access`
3. Instala as dependências:
   `npm install`
4. Inicia o servidor de desenvolvimento:
   `ng serve`
5. Acede ao terminal no teu browser através de: `http://localhost:4200`

---

## 👤 Sobre o Desenvolvedor

Desenvolvido por **Rodrigo Ribeiro**. 
Transformar lógica complexa em experiências imersivas é a minha paixão. Se queres debater sobre arquiteturas baseadas em eventos (RxJS), design de aplicações Angular ou desenvolvimento *data-driven*, liga-te a mim:

* **LinkedIn:** [O meu perfil profissional](https://linkedin.com/in/SEU-LINKEDIN-AQUI)
* **E-mail:** rodrigong@gmail.com
