/**
 * enchant();
 * Preparação para o uso do enchant.js.
 * (Exporta a classe enchant.js para o namespace global.
 *  ex.: enchant.Sprite -> Sprite etc..)
 *
 */
enchant();

/**
 * Declaração prévia do objeto jogo e objetos associados, possibilita que funções
 * os visualizem.
 *  
 */ 
var game;

var ambiente;

/**
 * Constantes do jogo. 
 */
var VELOCIDADE_PULO = 18.5;
var ESPACO_COLISAO = 6;

/**
 * Variáveis do jogo.
 * 
 */
var blocos = new Array;

var comeco = Date.now();

/*
 * window.onload
 *
 * A função será executada após o carregamento da página.
 * Comandos na enchant.js como "new Core();" causarão erros se executados antes do carregamento da página inteira.
 *
 */
window.onload = function() {
    /**
     * new Core(width, height)
     *
     * Cria uma instância de enchant.Core. Define o tamanho da janela para 320x320.
     * 
     */
	game = new Core(800, 600);
	
	/**
	 * Core.fps
	 * 
	 * Define o fps (frames por segundo) do jogo para 60.
	 *  
	 */
	game.fps = 60;
	
	/**
	 * Core.scale
	 * 
	 * Define a escala do jogo para 1, mantendo o aspecto gráfico original.
	 *  
	 */
	game.scale = 1;
	
	/**
	 * Core.keybind(tecla, id)
	 * 
	 * Faz o binding das teclas W, A, S e D para as direções Cima, Esquerda, 
	 * Baixo e Direita, respectivamente. 
	 *  
	 */
	game.keybind(65, 'left');	
	game.keybind(68, 'right');
	game.keybind(87, 'up');
	game.keybind(83, 'down');
	
    /**
     * Core.preload(resource)
     *
     * É realizado o carregamento de todos os assets antes do jogo começar.
     * 
     */
    game.preload("resources/images/robot.png", "resources/images/background.png", "resources/images/block.png");
    
    /**
     * Core.onload()
     *
     * game.onload = function(){
     *     // code
     * }
     *
     * game.addEventListener("load", function(){
     *     // code
     * })
     */
    game.onload = function() {

		ambiente = new Sprite(800, 600);
		
		ambiente.image = game.assets["resources/images/background.png"];
		
		ambiente.x = ambiente.y = 0;
		
    	var robo = new Robo(200, 200);
    	
    	/**
    	 * ambiente touchend
    	 * 
    	 * Ao soltar o clique no ambiente, realizar ação selecionada, que pode ser:
    	 * 
    	 * 	Criar bloco no ambiente.
    	 * 	Destruir bloco do ambiente.
    	 * 	Criar bloco de mola no ambiente.
    	 * 	Criar bloco transpassado no ambiente.
    	 *  
    	 */
    	ambiente.addEventListener("touchend", function(evt) {
    		
			addBloco(evt.localX, evt.localY);
    	});
    	
    	
    	/**
    	 * game on enterframe 
    	 * 
    	 * Realiza verificações e operações do jogo que acontecem a cada frame.
    	 * 
    	 * O que é feito nesta função:
    	 * 	Testes de colisão dos robôs com blocos.
    	 *  Testes de colisão entre os robôs (Falta Implementar). 
    	 *  
    	 */
    	game.addEventListener("enterframe", function(evt) {
    		
    		/**
    		 * Testes de colisão do robô com os blocos.
    		 *  
    		 */
    		for (var b = 0; b < blocos.length; b++) {
    			
    			/**
    			 * Robô colide com o bloco por baixo (cabeceando).
    			 *  
    			 */
    			if ( robo.y < blocos[b].y + blocos[b].height && robo.y > blocos[b].y 
    				&& robo.x + robo.width > blocos[b].x + ESPACO_COLISAO 
    				&& robo.x < blocos[b].x + blocos[b].width - ESPACO_COLISAO ) {
    				
    				robo.aceleracaoCima = 0;
    				robo.y = blocos[b].y + blocos[b].height;
    			}
    			
    			/**
    			 * Robô colide com o bloco por cima (pisando).
    			 *  
    			 */
    			if ( robo.aceleracaoCima <= 0 && robo.y + robo.height > blocos[b].y 
    				&& robo.y + robo.height < blocos[b].y + blocos[b].height 
    				&& robo.y + robo.height - robo.aceleracaoBaixo - ESPACO_COLISAO < blocos[b].y 
    				&& robo.x + robo.width > blocos[b].x + ESPACO_COLISAO 
    				&& robo.x < blocos[b].x + blocos[b].width - ESPACO_COLISAO ) {
    				
    				robo.y = blocos[b].y - robo.height;
    				
    				robo.pulando = false;
    				
    				robo.aceleracaoBaixo = 0;
    			}
    			
    			/**
    			 * Robô colide com o bloco pela direita.
    			 * 
    			 */
    			else if ( robo.x+robo.width > blocos[b].x && robo.x < blocos[b].x 
    				&& robo.y+robo.height > blocos[b].y + ESPACO_COLISAO
    				&& robo.y < blocos[b].y + blocos[b].height - ESPACO_COLISAO ) {
    				
    				robo.x = robo.x - (robo.x + robo.width - blocos[b].x);
    			}
    			
    			/**
    			 * Robô colide com o bloco pela esquerda.
    			 *  
    			 */
    			else if ( robo.x < blocos[b].x + blocos[b].width && robo.x > blocos[b].x 
    				&& robo.y + robo.height > blocos[b].y + ESPACO_COLISAO 
    				&& robo.y < blocos[b].y + blocos[b].height - ESPACO_COLISAO) {
    				
    				robo.x = robo.x + (blocos[b].x + blocos[b].width - robo.x);
    			}
    		}
    	});

    	/**
    	 * Adiciona os objetos do jogo à cena principal.
    	 *  
    	 */
    	game.rootScene.addChild(ambiente);
    	game.rootScene.addChild(robo);
    	
		/*
		 * Cria a plataforma de blocos que começa com o jogo.
		 * 
		 */
		criarPlataforma();
    };
    
    /**
     * Core.start()
     * 
     * Outras funções relacionadas: Core.pause() e Core.resume();
     * 
     */
    game.start();
};

/**
 * Funções do jogo.
 * 
 * Criadas para ajudar na manutenção de código e evitar duplicação.
 *  
 */

/**
 * Função usada para criar blocos de uma plataforma inicial, ao começar o jogo,
 * possibilitando os robôs caminharem sobre ela.
 *  
 */
function criarPlataforma() {

	addBloco(230, 320);
	
	for (var i = 230; i < 630; i++) {
		addBloco(i, 360);
	}
	
	addBloco(630, 320);
}

/**
 * Define o lugar (x,y) na grade onde um bloco será adicionado.
 *  
 */
function lugar(x, y) {
	
	var larguraTela = 800, larguraBloco = 40,
		alturaTela  = 600, alturaBloco  = 40,
		xProximo = 0, yProximo = 0;
		
	/**
	 * Buscando pelo x mais próximo. 
	 */
	for (var i = 0; i < (larguraTela/larguraBloco); i++) {
		
		if (x <= xProximo + larguraBloco) {
			break;
		}
		else {
			xProximo += larguraBloco;
		}
	}
	
	/**
	 * Buscando pelo y mais próximo.
	 *  
	 */
	for (var i = 0; i < (alturaTela/alturaBloco); i++) {
		if (y <= yProximo + alturaBloco) {
			break;
		}
		else {
			yProximo += alturaBloco;
		}
	}
	
	return { x: xProximo, y: yProximo };
}


/**
 * addBloco(x, y)
 * 
 * Adiciona um bloco à grade do jogo.
 *   
 * @param {Object} x posição x do bloco.
 * @param {Object} y posição y do bloco.
 */
function addBloco(x, y) {
	
	var bloco = new Sprite(40, 40);
	
	bloco.image = game.assets["resources/images/block.png"];

	var ponto = lugar(x, y);
	
	bloco.x = ponto.x, bloco.y = ponto.y;
	
	blocos.push(bloco);
	
	game.rootScene.addChild(bloco);
}

