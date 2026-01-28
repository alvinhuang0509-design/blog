import React, { type FC } from "react";
import type { IconType } from "react-icons";
import * as FaIcons from "react-icons/fa6";
// import * as AiIcons from "react-icons/ai";
// import * as BsIcons from "react-icons/bs";
// import * as FiIcons from "react-icons/fi";
// import * as Io5Icons from "react-icons/io5";
// import * as RiIcons from "react-icons/ri";
// import * as TbIcons from "react-icons/tb";
// import * as TfiIcons from "react-icons/tfi";

type IconMap = Record<string, IconType>;

interface IDynamicIcon extends React.SVGProps<SVGSVGElement> {
  icon: string;
  className?: string;
}

const iconLibraries: { [key: string]: IconMap } = {
  fa: FaIcons,
  cu: {
    CuXiaohongshu: (props) => (
      <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
        <path
          fill="currentColor"
          d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm4.6 6.7-3.02 3.02 3.02 3.02a1 1 0 1 1-1.414 1.415l-3.02-3.02-3.02 3.02A1 1 0 0 1 7.73 14.74l3.02-3.02-3.02-3.02A1 1 0 1 1 9.144 7.28l3.02 3.02 3.02-3.02A1 1 0 0 1 16.6 8.7Z"
        />
      </svg>
    ),
    CuDouyin: (props) => (
      <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
        <path
          fill="currentColor"
          d="M14 3a1 1 0 0 1 1 1v6.2a4.5 4.5 0 0 0 3 1.8 1 1 0 1 1 0 2 6.5 6.5 0 0 1-4-1.4V16a4 4 0 1 1-2-3.465V4a1 1 0 0 1 1-1Z"
        />
      </svg>
    ),
  },
};

const DynamicIcon: FC<IDynamicIcon> = ({ icon, ...props }) => {
  const IconLibrary = getIconLibrary(icon);
  const Icon = IconLibrary ? IconLibrary[icon] : undefined;

  if (!Icon) {
    return null;
  }

  return <Icon {...props} />;
};

const getIconLibrary = (icon: string): IconMap | undefined => {
  const libraryKey = icon.substring(0, 2).toLowerCase();

  return iconLibraries[libraryKey];
};

export default DynamicIcon;
