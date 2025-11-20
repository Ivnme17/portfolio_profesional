import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'portfolio_ivan';
  themes = ['dark', 'light', 'christmas'] as const;
  currentThemeIndex = 0;
  currentTheme = this.themes[this.currentThemeIndex];
  themeIcons = {
    dark: 'dark_mode',
    light: 'light_mode',
    christmas: 'ac_unit' // Copo de nieve para navidad
  };
  currentIcon = this.themeIcons[this.currentTheme];
  private audio?: HTMLAudioElement;
  private snowflakesContainer?: HTMLElement;
  private snowflakesInterval?: any;

  ngOnInit() {
    // Verificar si hay una preferencia guardada en localStorage
    const savedTheme = localStorage.getItem('theme') as typeof this.themes[number];
    if (savedTheme && this.themes.includes(savedTheme)) {
      this.currentTheme = savedTheme;
      this.currentThemeIndex = this.themes.indexOf(savedTheme);
      this.updateTheme(this.currentTheme);
    } else {
      // Verificar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? 'dark' : 'light';
      this.currentThemeIndex = prefersDark ? 0 : 1;
      this.updateTheme(this.currentTheme);
    }
  }

  ngOnDestroy() {
    // Detener la música y limpiar efectos al salir
    if (this.audio) {
      this.audio.pause();
      this.audio = undefined;
    }
    this.clearSnowflakes();
  }

  toggleTheme() {
    this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
    this.currentTheme = this.themes[this.currentThemeIndex];
    this.updateTheme(this.currentTheme);
    // Guardar preferencia
    localStorage.setItem('theme', this.currentTheme);
  }

  private updateTheme(theme: string) {
    this.currentIcon = this.themeIcons[theme as keyof typeof this.themeIcons];
    document.documentElement.setAttribute('data-theme', theme);
    
    // Limpiar efectos de nieve si existen
    this.clearSnowflakes();
    
    // Manejar la música de navidad
    if (theme === 'christmas') {
      this.playChristmasMusic();
    } else {
      // Detener música al cambiar de tema
      if (this.audio) {
        this.audio.pause();
        this.audio = undefined;
      }
    }
  }

  private createSnowflakes() {
    // Crear contenedor de copos si no existe
    this.snowflakesContainer = document.getElementById('snowflakes') || this.createSnowflakesContainer();
    
    // Crear copos de nieve
    this.snowflakesInterval = setInterval(() => {
      if (this.currentTheme !== 'christmas') {
        this.clearSnowflakes();
        return;
      }
      
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      
      // Tamaño aleatorio entre 5 y 15px
      const size = Math.random() * 10 + 5;
      snowflake.style.width = `${size}px`;
      snowflake.style.height = `${size}px`;
      
      // Opacidad aleatoria
      snowflake.style.opacity = (Math.random() * 0.5 + 0.3).toString();
      
      // Posición inicial aleatoria en la parte superior
      snowflake.style.left = `${Math.random() * 100}%`;
      snowflake.style.top = '-20px';
      
      // Duración de la animación entre 5 y 15 segundos
      const duration = Math.random() * 10 + 5;
      snowflake.style.animation = `snowfall ${duration}s linear infinite`;
      
      // Añadir el copo al contenedor
      this.snowflakesContainer?.appendChild(snowflake);
      
      // Eliminar el copo después de que termine la animación
      setTimeout(() => {
        snowflake.remove();
      }, duration * 1000);
      
    }, 300); // Nuevo copo cada 300ms
  }
  
  private createSnowflakesContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'snowflakes';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '1000';
    document.body.appendChild(container);
    return container;
  }
  
  private clearSnowflakes() {
    if (this.snowflakesInterval) {
      clearInterval(this.snowflakesInterval);
      this.snowflakesInterval = undefined;
    }
    
    const container = document.getElementById('snowflakes');
    if (container) {
      container.remove();
    }
  }
  
  private playChristmasMusic() {
    if (!this.audio) {
      // Música de fondo navideña suave (versión instrumental de Jingle Bells)
      this.audio = new Audio('/assets/audio/christmasbgmusic.mp3');
      this.audio.loop = true;
      this.audio.volume = 0.05; // Volumen bajo para no ser intrusivo
      
      // Reproducir después de la interacción del usuario
      this.audio.play().catch(e => console.log('Error al reproducir música:', e));
      
      // Crear copos de nieve
      this.createSnowflakes();
    }
  }
}
