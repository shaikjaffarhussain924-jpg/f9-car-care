import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee";

const t = (name: string, text: string) => ({
  author: { name, handle: "", avatar: "" },
  text,
});

const testimonials = [
  t("Mayank Bhandari", "Nice work for car denting and painting. Very professional and affordable service rates. Nice host Mr. Mujeeb Shaik."),
  t("Satish Jay", "I recently had both polishing and painting work done for my car at F9 Car Care & Denting Studio, and I'm honestly very impressed with their work. The polishing gave the car a brand-new shine, and the painting was done with perfect color matching and a smooth, factory-like finish."),
  t("surendra kumar", "Graphine matrix coating to my Nexon white colour Really amazing. F9 Car wash team really helpful. First of all they don't suggest extra accessories which I really like. Cost is really affordable. I suggest take decision visit F9 once."),
  t("Mohan Koppula", "Went to F9 clinic with natural doubts on How work will be done and costing for coating. However post delivery, am clear that they did very good work, in addition to Teflon coating, they also did interior seat detailing."),
  t("Ramesh Sai", "First time at F9 for a car wash - wow! Sparkling clean & super reliable. The staff was friendly & I felt completely trustworthy. Definitely recommend it! Will be back."),
  t("Kumar Goud", "Our very old Ford fiesta (2006 model) car is maintained and everything (servicing, denting, AC repair etc). Since last 5 years almost these service centre technicians are including pickup and dropping very sincerely with reasonable billing."),
  t("asish vk", "Very good service at affordable price. Did a polishing and waxing for my Jetta and impressed with the result. They are not pushing for any service, which I liked. And the updates were regular on the work on progress. Recommended."),
  t("Arindam Das", "I bought my Creta around 6 months back. Generally a careful driver, however, as we all know it is just not your careful driving that is enough on Hyderabad roads. F9 team handled the repair excellently."),
  t("prabhukumar lella", "It's Graphine matrix coating to my I20 starynight colour. Really amazing. F9 Car wash team really helpful to select accessories and sun films too. They don't suggest extra accessories which I really like. Cost is really reasonable."),
  t("vijay kumar", "I recently got my Skoda Kushaq car coloured at F9 Studios and it was too good and amazing! The quality of the paint job is excellent — the finish is smooth, shiny and looks brand new. The team was very professional."),
  t("harsh jain", "Best car service station in hyderabad. Best staff and good behaviour. They even do car repair works best in car denting painting, ceramic coating and ppf paint protection film works."),
  t("Adishesha B", "Got paint correction, ceramic coating and a door denting with repainting done. Absolutely phenomenal work. Would 100% Recommend. Looks like brand new again."),
  t("Bharat K", "PPF for Ather 450 x vehicle, Staff were doing good job. Happy with their service and quoted best price."),
  t("Pruthvi Kalidindi", "Car detailing did PPF, film, matting here. They are professional."),
  t("Md Sufyan", "My old restored to new. Car painting and denting done with perfection amazing finish thanks to F9 car care team they have done fabulous job. Just go with their services you will be amazed."),
  t("Abhishek Sinha", "Great experience. Best place for car detailing. Highly recommended."),
  t("Chandra Shekar", "Car painting and denting has been done very superb. You can trust these guys they provide quality service. Even car repairs and car mechanic work has been done."),
  t("Muhammad Nomaan", "Done with car painting, car mechanic repair service and car polishing teflon coating they have done exceptional work. Go with their services, affordable also."),
  t("Surya Teja", "Folks at this place have a really good knowledge on ppf and its maintenance. I didn't have to worry about the ppf application since this place is an authorized Garware application studio and they have done the job really well on my new car."),
  t("Praveen Munnuru", "My Innova conversion done from type 2 to type 4. Best car painting done, best car denting done."),
  t("Venkatram thota", "Wonderful ceramic coating. My car seems new one. The services are good. Periodically if repeat this coat car seems new one. I prefer and advise everyone to come here and get refresh."),
  t("Mahesh Babu Uppala", "Done with ppf. Nice work. Now my car looks like new. Thank you F9 car wash team."),
  t("Satya Nadam", "They have done an excellent job. My car is protected with ppf. Even they have done ppf ceramic on top."),
  t("Naveen Kanna Pasupuleti", "Did Ceramic coating really well for my Fronx. Worth the price. Good support."),
  t("Rupesh Patil", "F9 car wash best service providers in town with understanding staff members and good nature owner."),
  t("Vikram Reddy Patlolla", "Excellent cleaning services, staff is professional and the job was done smoothly. Thank you, Mujeeb."),
  t("Gopi nath", "I have given my BMW 320D for ceramic coating last year and denting, painting work now. Very nicely done and very much economical as well. They even help getting parts as well if needed. All in one shop I would say."),
  t("Ayush Samaiya", "Excellent work quality in every aspect. I have given my car for complete car service, car engine oil change and car polishing. They even offer ceramic coating and ppf services. Just go with their services they do excellent work. Best car care."),
  t("madhan marthala", "Car denting and painting work done very neatly. Even car mechanical service they do perfectly."),
  t("Kranthi Pammi", "F9 car has done superb job. My car had many damages and all were recovered by F9 team with high skill workmanship. Really appreciate the work and the response from the owner Muzeeb. Very humble and honest person."),
  t("Vikas Srivastava", "My XUV700 vehicle was dirtied by wet cement material and F9 team did a great job by cleaning it. Mujeeb has helped a lot with his team and pricing was also good."),
  t("meena jyothi", "My car is ceramic protected for 5 years. They provide excellent car ceramic coating services."),
  t("Rajkishore Mohapatra", "In Hyderabad I am sure there are many persons who are good in dents, color spraying and other services but you have not seen the best until you visit F9!"),
  t("jayanth velagapudi", "I had given the car for an interior cleaning. I was initially very sceptical about giving my MG here but trust me these guys have done a great job. Mr. Mujeeb was very prompt and was letting me know the progress with photos and videos."),
  t("SRINIVAS P", "Excellent denting & painting work done. Great polishing work and car washing."),
  t("Asif Shaik", "Muzeeb the owner of F9 car care is excellent in his workmanship and maintains good relationship. I have given my TATA Harrier for Graffine coating, it's almost 6 months old now my car still looks new. Thank you so much Muzeeb."),
  t("revanth balla", "They did a very good job on my car Virtus. They totally removed all the scratches on the bonnet and made it look brand new again."),
  t("hanumanth Akula", "Great. Done PPF for both our cars MG Hector & Creta. Satisfied with the way the work was done with skilled professionals."),
  t("pavan reddy", "Done Teflon coating for my car VW Vento here. The car look changed and I am very satisfied with the work done."),
  t("MD Basha", "Done with Denting & painting and protected with ceramic coating. They have done fabulous work, very less price, quality work has been done."),
  t("padda reddy Mallidi", "Affordable pricing for PPF and professional staff."),
  t("prasad mangapathi", "Good service provided and I am very happy to see my car after completing the ppf."),
  t("Santosh Sanapathi", "Took services for Graphene coating and under body coating. Had great experience with staff and services. 100% satisfied."),
  t("Naveen Kumar", "Excellent work. Showroom finishing can be expected here. Teflon coating, denting — any work equal to showroom within budget."),
  t("Kirankumar Kalidindi", "Excellent Ceramic coating work. They even do good paint protection film and car washing services."),
  t("shaik imam", "Excellent centre for Car washing, detailing and also for car repairs especially all general car maintenances. They have a special cell for ceramic coating and other detailings and the staff is well disciplined and professionally excellent. Job will be done fast and efficient."),
  t("Prashanth Chamakuri", "Recently got paint work done here and they did very clean and now my car looks like a new one."),
  t("Srivardhan Rinku", "Car denting / painting done very neat and accurately. Trust these guys, go for it."),
  t("Bhavitha Siva", "Interior cleaning done very professionally."),
  t("Kollipara K", "Good Work. Whatever the car may be, however old it was, you can get the good look & work finishing in time & super work."),
  t("Sai Rishi", "Excellent work and affordable price."),
  t("Rahul Bansal", "Really an amazing experience for me as well as for my car. Got my car a new look with genuine quality products."),
  t("Govardhan Perasani", "Appreciate the work done by the team and very good response from Muzeeb. One of the best places for denting and painting."),
  t("naresh palle", "Qualified and efficient workers, detailing was good and more services (paint protection, ceramic coating, wrapping) are in pipeline."),
  t("Sreeniketh Reddy", "Perfect job for car painting!"),
  t("Sangamesh K", "Good neat work, using quality material, reasonable price and supporting staff and timely delivery."),
];

const Testimonials = () => {
  return (
    <section id="testimonials">
      <TestimonialsSection
        title="Client Experiences"
        description="Trusted by car owners across Hyderabad for 20+ years"
        testimonials={testimonials}
        className="section-padding"
      />
    </section>
  );
};

export default Testimonials;
