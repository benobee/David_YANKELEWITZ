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

		console.log(this);
	},
	animateProjectScroll(content) {

		/*
		 * @desc scroll to project item when
		 * needed to focus on project
		*/

		const module = $(content).parent().find('.module-injection');
		const offset = window.innerHeight * 0.07;
		const y = $(content).offset().top - offset;

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
	projectPage() {
		const page = $('.collection-type-david_projects.view-item');
		console.log(page.length);
		if (page.length !== 0) {
			this.initCarousel();
		}
	},
	initCarousel(target) {
		let owl = {};

		if (target.length === 1) {
			owl = $(target).find('.owl-carousel');				
		} else {
			owl = $('.owl-carousel');
		}

		$(owl).owlCarousel({
			items: 1,
			autoplay: false,
			loop: false,
			margin:30,
			mouseDrag: true,
			nav: false,
			dots: false,
			stagePadding: 0,
			autoWidth: true,
			lazyLoad: true,
			rewind: true,
			onInitialized(){
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
	},
	smoothCloseSlide() {

		/*
		 * @desc smoother transition for slide closing
		*/
	
		$('.next.item i').attr('class', 'fa fa-arrow-right');	
		TweenMax.to(".project-item .content", 0.2, {height: "37vh", opacity: 1, scale: 1});	
		TweenMax.to(".module-injection", 0.4, {opacity: 0, visibility: 'hidden'});
		TweenMax.set(module, {height: 0});
	},
	events() {

		/*
		 * @desc user clicks on slide to reveal projects
		*/
		
		$('.project-item .content').on("click", (e) => {
			const parent = $(e.currentTarget).parent();

			this.toggleActiveStyles(parent);
			this.animateProjectScroll(e.currentTarget);	
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
		});

		//go to next item in project list
		$('.up.item').on("click", (e) => {
			const index = $(e.currentTarget).data("index");

			const content = $(this.array[index - 2]).find('.content');
			const parent = $(content).closest('.project-item');

			this.toggleActiveStyles(parent);
			this.animateProjectScroll(content);
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