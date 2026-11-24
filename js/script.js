js = r"""/* =========================================================
   script.js — Interações e animações do site Maicon Joder
   Efeitos:
   1. Fade-in suave durante a rolagem
   2. Menu mobile com abertura/fechamento acessível
   3. Entrada progressiva da lista de serviços
   4. Atualização automática do ano no rodapé

   Os efeitos de hover dos cards e botões são feitos em CSS.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* -----------------------------------------------------
       1. ANO AUTOMÁTICO NO RODAPÉ
    ----------------------------------------------------- */
    const copyrightYear = document.getElementById("copyright-year");

    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    /* -----------------------------------------------------
       2. MENU MOBILE
    ----------------------------------------------------- */
    const menuButton = document.querySelector(".header__mobile-button");
    const mobileMenu = document.getElementById("mobile-menu");

    if (menuButton && mobileMenu) {
        const menuLinks = mobileMenu.querySelectorAll("a");

        const openMenu = () => {
            mobileMenu.hidden = false;
            menuButton.setAttribute("aria-expanded", "true");
            menuButton.setAttribute("aria-label", "Fechar menu de navegação");
            document.body.classList.add("menu-is-open");

            // Permite que o navegador aplique o estado inicial antes da transição.
            requestAnimationFrame(() => {
                mobileMenu.classList.add("is-open");
            });
        };

        const closeMenu = () => {
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Abrir menu de navegação");
            mobileMenu.classList.remove("is-open");
            document.body.classList.remove("menu-is-open");

            if (reduceMotion) {
                mobileMenu.hidden = true;
                return;
            }

            const finishClosing = (event) => {
                if (event && event.target !== mobileMenu) return;
                mobileMenu.hidden = true;
                mobileMenu.removeEventListener("transitionend", finishClosing);
            };

            mobileMenu.addEventListener("transitionend", finishClosing);
            // Fallback caso não ocorra transitionend.
            window.setTimeout(() => {
                if (!mobileMenu.classList.contains("is-open")) {
                    mobileMenu.hidden = true;
                }
            }, 450);
        };

        menuButton.addEventListener("click", () => {
            const isExpanded =
                menuButton.getAttribute("aria-expanded") === "true";

            if (isExpanded) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        menuLinks.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" &&
                menuButton.getAttribute("aria-expanded") === "true") {
                closeMenu();
                menuButton.focus();
            }
        });

        document.addEventListener("click", (event) => {
            const clickedInsideMenu = mobileMenu.contains(event.target);
            const clickedButton = menuButton.contains(event.target);
            const isExpanded =
                menuButton.getAttribute("aria-expanded") === "true";

            if (isExpanded && !clickedInsideMenu && !clickedButton) {
                closeMenu();
            }
        });

        // Se a tela voltar ao tamanho desktop, garante que o menu mobile feche.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 991 &&
                menuButton.getAttribute("aria-expanded") === "true") {
                closeMenu();
            }
        });
    }

    /* -----------------------------------------------------
       3. REVELAÇÃO SUAVE AO ROLAR A PÁGINA
    ----------------------------------------------------- */
    const revealElements = document.querySelectorAll(
        ".hero__content, " +
        ".services-info__intro, " +
        ".services-info__list-wrapper, " +
        ".about__content, " +
        ".services__header, " +
        ".service-card, " +
        ".services__action, " +
        ".contact__content, " +
        ".footer__container"
    );

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    } else {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach((element) => {
            element.classList.add("reveal");
            revealObserver.observe(element);
        });
    }

    /* -----------------------------------------------------
       4. ENTRADA PROGRESSIVA DA LISTA DE SERVIÇOS
    ----------------------------------------------------- */
    const serviceItems = document.querySelectorAll(
        ".services-info__item"
    );

    if (reduceMotion || !("IntersectionObserver" in window)) {
        serviceItems.forEach((item) => {
            item.classList.add("is-visible");
        });
    } else {
        const listObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const item = entry.target;
                        const index = Array.from(serviceItems).indexOf(item);

                        item.style.setProperty(
                            "--reveal-delay",
                            `${index * 90}ms`
                        );
                        item.classList.add("reveal", "is-visible");
                        observer.unobserve(item);
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: "0px 0px -25px 0px"
            }
        );

        serviceItems.forEach((item) => {
            item.classList.add("reveal");
            listObserver.observe(item);
        });
    }
});
"""
