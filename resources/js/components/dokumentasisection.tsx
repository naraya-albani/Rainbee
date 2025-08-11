interface Feature {
  image?: string; 
  video?: string;
  title: string;
  description: string;
}

interface Timeline3Props {
  heading: string;
  description: string;
  features?: Feature[];
}

const Timeline3 = ({
  heading = "Experience the difference with us",
  description = "We believe in creating lasting partnerships with our clients, focusing on long-term success through collaborative innovation and dedicated support.",
  features = [
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-4.svg",
      title: "Dedicated Support",
      description:
        "Expanded operations to 5 new countries, reaching millions of new users.",
    },
    {
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-5.svg",
      title: "Series B Funding",
      description:
        "Secured $50M in Series B funding to accelerate product development.",
    },
    {
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      title: "Company Video",
      description: "Watch our company journey in this short video.",
    },
  ],
}: Timeline3Props) => {
  return (
    <section className="py-32">
      <div className="container max-w-6xl">
        <div className="relative grid gap-16 md:grid-cols-2">
          <div className="top-40 h-fit md:sticky">
            <h2 className="mt-4 mb-6 text-4xl font-semibold md:text-5xl text-[#f59e0b]">
              {heading}
            </h2>
            <p className="font-medium text-muted-foreground md:text-xl">
              {description}
            </p>
          </div>

          <div className="flex flex-col gap-12 md:gap-20">
            {features?.map((feature, index) => (
              <div key={index} className="rounded-xl border p-2">
                {feature.video ? (
                  <iframe
                    src={feature.video}
                    className="aspect-video w-full rounded-xl border border-dashed"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="aspect-video w-full rounded-xl border border-dashed object-cover"
                  />
                )}

                <div className="p-6">
                  <h3 className="mb-1 text-2xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Timeline3 };
