import $ from 'jquery-slim';
import {
    TweenMax,
    Power2,
    TimelineLite
} from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import util from './util';

const controller = {
    init() {
        this.events();
        this.indexArray();
        this.focalPoints();
        this.hoverEffects();
    },
    focalPoints() {
        const targets = $('.page-banner-image-container .image, .project-item .image').toArray();

        util.focalPoints(targets);
    },
    hoverEffects() {

        /*
         * @desc when user clicks on any other link besides
         * an index collection in the main nav, smooth scroll
         * to footer - maybe better to hard code into template
         * but will leave for now
         */

        $('.project-item').on("mouseenter", (e) => {
            $(".project-item").removeClass("hover");
            $(e.currentTarget).addClass("hover");
        });
    },
    animateProjectScroll(content) {

        /*
         * @desc scroll to project item when
         * needed to focus on project
         */

        const module = $(content).parent().find('.module-injection');
        const offset = window.innerHeight * 0.08;
        const y = $(content).offset().top - offset;
        const summaryContent = $(module).find('.summary');

        TweenMax.set(content, {
            height: "84vh",
            onComplete: () => {
                TweenMax.to(window, 0.35, {
                    scrollTo: {
                        y: y,
                        x: 0
                    },
                    onComplete: () => {
                        TweenMax.to(content, 0.2, {
                            opacity: 0,
                            scale: 1.05
                        });
                        TweenMax.to(module, 0.6, {
                            opacity: 1,
                            visibility: 'visible',
                            delay: 0.35
                        });
                        TweenMax.set(module, {
                            height: '100%',
                            onComplete: () => {
                                this.initSlide(module);
                            }
                        });
                    }
                });
            }
        });
    },
    initSQS() {
        window.Squarespace.AFTER_BODY_LOADED = false;
        window.Squarespace.afterBodyLoad();
    },
    initSlide(module) {
        //fade text in
        const description = $(module).find('.project-content');

        TweenMax.to(description, 0.6, {
            opacity: 1,
            visibility: 'visible',
            delay: 0.6
        });

        this.initSQS();
    },
    toggleActiveStyles(parent) {

        /*
         * @desc reset styles for list items
         */
        $('.project-item').removeClass('active-slide');

        $(parent).addClass('active-slide');

        //reset arrow
        $('.next.item i').attr('class', 'fa fa-arrow-right');

        TweenMax.set(".project-item .content", {
            height: "60vh",
            opacity: 1,
            scale: 1
        });
        TweenMax.set(".module-injection", {
            opacity: 0,
            visibility: 'hidden',
            height: 0
        });
        TweenMax.to('.module-injection .project-content', 0.6, {
            opacity: 0,
            visibility: 'hidden'
        });
    },
    smoothCloseSlide() {

        /*
         * @desc smoother transition for slide closing
         */

        $('.next.item i').attr('class', 'fa fa-arrow-right');
        TweenMax.to(".project-item .content", 0.2, {
            height: "60vh",
            opacity: 1,
            scale: 1
        });
        TweenMax.to(".module-injection", 0.4, {
            opacity: 0,
            visibility: 'hidden'
        });
        TweenMax.set(module, {
            height: 0
        });
        TweenMax.to('.module-injection .project-content', 0.6, {
            opacity: 0,
            visibility: 'hidden'
        });
    },
    events() {

        /*
         * @desc user clicks on slide to reveal projects
         */

        $('.project-item .content').on("click", (e) => {
            const parent = $(e.currentTarget).parent();

            this.toggleActiveStyles(parent);
            this.animateProjectScroll(e.currentTarget);
            TweenMax.set('.module-injection .controls .next.item', {
                opacity: 0,
                visibility: 'hidden'
            });
        });

        //close start close slide handlers
        $('.close.item').on("click", (e) => {
            $('.project-item').removeClass('active-slide');
            this.smoothCloseSlide();
        });

        //go to next item in project list
        $('.down.item, .last-slide').on("click", (e) => {
            const index = $(e.currentTarget).data("index");

            if (index !== this.array.length) {
                const target = $(this.array[index]).find('.content');
                const parent = $(target).parent('.project-item');

                this.toggleActiveStyles(parent);
                this.animateProjectScroll(target);

            } else {
                const target = $('#footer');

                this.toggleActiveStyles(parent);
                TweenMax.to(window, 0.6, {
                    scrollTo: target[0]
                });
            }
            TweenMax.set('.module-injection .controls .next.item', {
                opacity: 0,
                visibility: 'hidden'
            });
        });

        //go to next item in project list
        $('.up.item').on("click", (e) => {
            const index = $(e.currentTarget).data("index");

            const content = $(this.array[index - 2]).find('.content');
            const parent = $(content).closest('.project-item');

            this.toggleActiveStyles(parent);
            this.animateProjectScroll(content);
            TweenMax.set('.module-injection .controls .next.item', {
                opacity: 0,
                visibility: 'hidden'
            });
        });

        //open extra content on mobile
        $('.project-item .read-more.button').on("click", (e) => {
            $('.extra-content').addClass("open");
        });

        $('.project-item .extra-content').on("click", (e) => {
            $('.extra-content').removeClass("open");
        });
    },
    indexArray() {
        this.array = $('.project-item').toArray();
    },
    getListData() {
        $.ajax({
            url: "https://david-yankelewitz.squarespace.com/projects?format=json",
            dataType: "jsonp",
            success: (result) => {
                this.data = result;
            },
            error: (error) => {
                console.log(error);
            }
        });
    }
};

export default controller;