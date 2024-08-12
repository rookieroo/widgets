import React, { useState, useEffect } from 'react';
import { Treemap, ResponsiveContainer } from 'recharts';
import {rgbToHex} from "../../utils/utils";

const ColorExtractor = ({ imageUrl }) => {
  const [colorData, setColorData] = useState([]);

  useEffect(() => {
    const extractColors = async () => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        const colorMap = new Map();
        const totalPixels = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          const r = Math.round(data[i] / 10) * 10;
          const g = Math.round(data[i + 1] / 10) * 10;
          const b = Math.round(data[i + 2] / 10) * 10;
          const rgb = `rgb(${r},${g},${b})`;
          const hex = rgbToHex(r, g, b);
          colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
        }

        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);

        const colorPercentages = sortedColors.map(([color, count]) => ({
          name: color,
          size: (count / totalPixels) * 100,
          color: color
        }));

        setColorData(colorPercentages);
      };

      img.onerror = () => {
        console.error('Failed to load image');
      };
    };

    extractColors();
  }, [imageUrl]);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={colorData}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="#fff"
          fill="#8884d8"
          content={<CustomizedContent />}
        />
      </ResponsiveContainer>
    </div>
  );
};

const CustomizedContent = ({ root, depth, x, y, width, height, index, payload, colors, rank, name }) => {

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: name,
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {width > 30 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
        >
          {`${name}`}
          {root?.children ? `${root?.children[index]?.size.toFixed(2)}%`: ''}
        </text>
      )}
    </g>
  );
};

export default ColorExtractor;