/**
 * Personagem robô. 
 * 
 * Herda da classe Sprite. Seu construtor recebe como parãmetros o
 * x, y onde o robô começará no jogo.
 */
var Robo = enchant.Class.create(enchant.Sprite, {
	
	/**
	 * Construtor da classe Robô.
	 */
	initialize: function (x, y) {
	
		/**
		 * Construtor da classe pai. 
		 */
		enchant.Sprite.call(this, 40, 40);
		
		this.image = game.assets["resources/images/robot.png"];
		
		this.prevX = 0;
    	
    	this.x = x;
    	 
    	this.y = y;
    	
    	this.keyClear = false;
    	
    	this.pulando = false;
    	
    	this.caindo = true;
    	
    	this.velocidade = 4;
    	
    	this.aceleracao = 0.5;
    	
    	this.aceleracaoCima = 0;
    	
    	this.aceleracaoBaixo = 0;
    	
    	this.tempoAr = 0;

		/**
		 * Evento update do robô.
		 * 
		 * Atualiza seu comportamento.
		 * O que é feito nesta função:
		 * 	Tratamento de entrada do usuário para movimentação do robô.
		 *  
		 */
    	this.addEventListener("enterframe", function() {
    		
    		/**
    		 * Grava a posição x antiga.
    		 * 
    		 */ 
    		this.prevX = this.x;
    		
	    	if (!game.input.up && !this.pulando) {
	    		this.keyClear = true;
	    	}
	    	
	    	/**
	    	 * Robô pula ao pressionar tecla para cima.
	    	 *  
	    	 */
	    	if (game.input.up && this.keyClear && !this.pulando && this.aceleracaoBaixo <= 0) {
	    		
	    		this.aceleracaoCima = VELOCIDADE_PULO / 2;
	    		
	    		this.aceleracaoBaixo = 0;
	    		
	    		this.pulando = true;
	    		
	    		this.keyClear = false; 
	    	}
	    	
	    	/**
	    	 * Limitação do pulo.
	    	 *  
	    	 */
            else if (game.input.up && this.pulando && this.tempoAr > 1 && this.tempoAr < 12) {
            	
                this.aceleracaoCima += 0.25;
            }
            
            /**
             * Queda mais rápida se o pulo não foi tão alto.
             *
             */  
            else if (this.pulando && this.aceleracaoCima > 0 && this.tempoAr < 50) {
            	
                this.aceleracaoCima -= 2;
            }
            
			/**
			 * Atualiza gravidade.
			 *
			 */  
			else {
				if (this.aceleracaoCima > 0)
					this.aceleracaoCima--;
				else if (this.aceleracaoBaixo < VELOCIDADE_PULO)
					this.aceleracaoBaixo += 0.3;
			}
			
			/**
			 * Jogador dá comando da esquerda.
			 *  
			 */
			if (game.input.left && this.x > 0) { 
				this.x -= this.velocidade * this.aceleracao;
			}
			
			/**
			 * Jogador dá comando da direita.
			 *  
			 */
			if (game.input.right && this.x + this.width < ambiente.width) { 
				this.x += this.velocidade * this.aceleracao;
			}

            /**
             * Atualiza a aceleração de movimento.
             *  
             */
            if ((game.input.left && this.prevX > this.x) || (game.input.right && this.prevX < this.x))
                this.aceleracao += 0.05;
            else
                this.aceleracao = 0.05;

            // Captura aceleração em 1
            if (this.aceleracao > 1)
                this.aceleracao = 1;
			
			// Pulo final
			if (this.aceleracaoCima > 0)
				this.y = this.y - this.aceleracaoCima;
			// Queda final
			else if (this.aceleracaoCima < 1) {
				this.y = this.y + this.aceleracaoBaixo;
			}
			

            // Atualizar tempo no ar.
            if (this.pulando)
                this.tempoAr++;
            else
                this.tempoAr = 0;
                
    	});
	},
	
});