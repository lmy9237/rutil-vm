import { useValidationToast }           from "@/hooks/useSimpleToast";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import { 
  handleInputChange
} from "@/components/label/HandleInput";

const VmConsole = ({
  formConsoleState, setFormConsoleState
}) => {
  const { validationToast } = useValidationToast()

  return (
    <>
      <LabelSelectOptions label="비디오 유형"
        value={formConsoleState.displayType}
        options={videoTypes}
        onChange={handleInputChange(setFormConsoleState, "displayType", validationToast)}
      />
      <LabelSelectOptions label="그래픽 프로토콜"
        value={formConsoleState.videoType}
        options={graphicProtocols}
        onChange={handleInputChange(setFormConsoleState, "videoType", validationToast)}
      />
    </>
  );
};

export default VmConsole;

const videoTypes = [
  { value: "qxl", label: "QXL" },
  { value: "vga", label: "VGA" },
  { value: "bochs", label: "BOCHS" },
];

const graphicProtocols = [
  { value: "vnc", label: "VNC" },
];