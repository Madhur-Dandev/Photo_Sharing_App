const Category = ({ cat_details }) => {
  /**
   * This component is use to display the single category with all of its style without code repeatition.
   */
  return (
    <a href="">
      <div
        style={{
          backgroundImage: `linear-gradient(to right, #ffffffb2, #000000b2), url(${cat_details.imgUrl})`,
        }}
        className="bg-cover w-full h-60 sm:h-72 rounded-3xl bg-center grid place-items-center"
      >
        <p
          className="text-slate-100 font-bold text-4xl"
          style={{ textShadow: "0px 2px 10px white" }}
        >
          {cat_details.title}
        </p>
      </div>
    </a>
  );
};

export default Category;
