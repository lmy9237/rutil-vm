import useAsideState from "@/hooks/useAsideState";
import "./SectionLayout.css"

const SectionLayout = ({
  ...props
}) => {
  const { 
    asideVisible, asideWidthInPx
  } = useAsideState()
  return (
    <div id="section"
      {...props}
    >
      {props.children}
    </div>
  );
};

export default SectionLayout;
