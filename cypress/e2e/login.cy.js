describe('Fluxo do Jogador', () => {
  it('Deve conseguir logar na sala', () => {
    // Assume que seu servidor local está rodando (veremos isso no CI)
    cy.visit('http://localhost:5500/index.html'); // Ajuste a porta se necessário

    // Verifica se a tela de login está visível
    cy.get('#login-screen').should('be.visible');

    // Digita o nome da sala
    cy.get('#input-sala').type('time_teste_ci');
    cy.get('#btn-login').click();

    // Verifica se entrou no jogo (tela de login sumiu e header apareceu)
    cy.get('#login-screen').should('not.be.visible');
    cy.get('#room-display').should('contain', 'time_teste_ci');
  });
});