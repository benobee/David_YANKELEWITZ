import $ from 'jquery';
import 'owl.carousel';
import { TweenMax, Power2, TimelineLite } from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";

const controller = {
	init() {
		this.getListData();
		this.events();
		this.indexArray();
		this.projectPage();
		this.navSmoothScroll();
	},
	navSmoothScroll() {

		/*
		 * @desc when user clicks on any other link besides
		 * an index collection in the main nav, smooth scroll
		 * to footer - maybe better to hard code into template
		 * but will leave for now
		*/

		$('#topNav li:not(.index-collection)').on("click", (e) => {
			e.preventDefault();
			TweenMax.to(window, 0.6, { scrollTo: '#footer' });
		});
	},
	animateProjectScroll(content) {

		/*
		 * @desc scroll to project item when
		 * needed to focus on project
		*/

		const module = $(content).parent().find('.module-injection');
		const offset = window.innerHeight * 0.07;
		const y = $(content).offset().top - offset;
		const summaryContent = $(module).find('.summary');

		//render the images for the carousel before animation
		this.renderImages(content);

		TweenMax.set(content, {height: "86vh", onComplete: () => {
			TweenMax.to(window, 0.35, { scrollTo:{y: y, x: 0}, onComplete: () => {
				TweenMax.to(content, 0.2, {opacity: 0, scale: 1.05});
				TweenMax.to(module, 0.6, {opacity: 1, visibility: 'visible', delay: 0.35 });
				TweenMax.set(module, {height: '100%', onComplete: () => {
					this.initCarousel(module);
				}});
			}});
		}});
	},
	initCarousel(module) {

		/*
		 * @desc init settings and bind event handlers
		 * for each carousel on a slide
		*/
	
		const owl = $(module).find('.owl-carousel');
		const wrapper = $(module).find('.carousel-wrapper');

		this.activeCarousel = owl;

		$(owl).owlCarousel({
			items: 1,
			autoplay: false,
			loop: false,
			margin:30,
			mouseDrag: true,
			nav: false,
			dots: false,
			stagePadding: 20,
			autoWidth: true,
			lazyLoad: false,
			rewind: true,
			responsiveRefreshRate: true,
			onInitialized(){

				TweenMax.to(wrapper, 0.6, {opacity: 1, visibility: 'visible', delay: 0.8 , onComplete: () => {
					TweenMax.to('.next.item', 1, {opacity: 1, visibility: 'visible' });
				}});

				//go to the next image in the carousel
				$('.next.item').on("click", (e) => {
					e.stopPropagation();
					owl.trigger('next.owl.carousel', [500]); 
				});

				owl.on('changed.owl.carousel', (event) => {
					const items = event.item.count;
					const item = event.item.index + 1;
					if (items === item) {
						$('.next.item i').attr('class', 'fa fa-arrow-left');
					} else {
						$('.next.item i').attr('class', 'fa fa-arrow-right');
					}
				});
			}
		});
	},
	renderImages(content) {

		/*
		 * @desc render images inside carousel on slide 
		 * click.
		*/

		const data = $(content).data('slide-index');
		const image = this.data.items[data - 1].customContent.gallery;
		const target = $(content).parent().find('.module-injection').find('.owl-carousel');

		$.each(image, (i, item) => {

			//create image div
			const slide = document.createElement('div');
			const imageWrapper = document.createElement('div');
			const img = document.createElement('img');

			//add item classes
			$(slide).addClass('item-slide image');
			$(imageWrapper).addClass('image-wrapper');

			//image attributes
			$(img).attr({
				src: item.assetUrl
			});

			//insert img element to wrapper
			$(imageWrapper).append(img);

			//insert img wrapper to main item div
			$(slide).append(imageWrapper);

			//append slide to image carousel
			$(target).append(slide);

		});
	},
	projectPage() {

		/*
		 * @desc currently not being used but will retain for
		 * any other future use
		*/
	
		const page = $('.collection-type-david_projects.view-item');

		if (page.length) {
			const owl = $('.owl-carousel');

			$(owl).owlCarousel({
				items: 1,
				autoplay: true,
				loop: false,
				margin:30,
				mouseDrag: true,
				nav: true,
				dots: false,
				stagePadding: 0,
				autoWidth: false,
				lazyLoad: false,
				rewind: true
			});				
		}
	},
	toggleActiveStyles(parent) {

		/*
		 * @desc reset styles for list items
		*/
		$('.project-item').removeClass('active-slide');

		$(parent).addClass('active-slide');
	
		//reset arrow
		$('.next.item i').attr('class', 'fa fa-arrow-right');

		TweenMax.set(".project-item .content", {height: "37vh", opacity: 1, scale: 1});	
		TweenMax.set(".module-injection", {opacity: 0, visibility: 'hidden', height: 0});

		this.destroyOwlCarousel();
	},
	destroyOwlCarousel() {
		TweenMax.killAll(false, false, true, false);

		TweenMax.set('.module-injection .controls .next.item', {opacity: 0, visibility: 'hidden' });
		TweenMax.set('.project-content .carousel-wrapper', {opacity: 0, visibility: 'hidden'});

		if (this.activeCarousel !== undefined) {
			$(this.activeCarousel).trigger('destroy.owl.carousel').removeClass('owl-loaded');
			$('.owl-carousel .item-slide.image').remove();
		}

		$('.next.item').off();
	},
	smoothCloseSlide() {

		/*
		 * @desc smoother transition for slide closing
		*/
	
		$('.next.item i').attr('class', 'fa fa-arrow-right');	
		TweenMax.to(".project-item .content", 0.2, {height: "37vh", opacity: 1, scale: 1});	
		TweenMax.to(".module-injection", 0.4, {opacity: 0, visibility: 'hidden'});
		TweenMax.set(module, {height: 0});

		this.destroyOwlCarousel();
	},
	events() {

		/*
		 * @desc user clicks on slide to reveal projects
		*/
		
		$('.project-item .content').on("click", (e) => {
			const parent = $(e.currentTarget).parent();

			this.toggleActiveStyles(parent);
			this.animateProjectScroll(e.currentTarget);
			TweenMax.killAll(false, false, true, false);
			TweenMax.set('.module-injection .controls .next.item', {opacity: 0, visibility: 'hidden' });
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
				TweenMax.to(window, 0.6, { scrollTo: target[0] });
			}
			TweenMax.killAll(false, false, true, false);
			TweenMax.set('.module-injection .controls .next.item', {opacity: 0, visibility: 'hidden' });
		});

		//go to next item in project list
		$('.up.item').on("click", (e) => {
			const index = $(e.currentTarget).data("index");

			const content = $(this.array[index - 2]).find('.content');
			const parent = $(content).closest('.project-item');

			this.toggleActiveStyles(parent);
			this.animateProjectScroll(content);
			TweenMax.killAll(false, false, true, false);
			TweenMax.set('.module-injection .controls .next.item', {opacity: 0, visibility: 'hidden' });
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