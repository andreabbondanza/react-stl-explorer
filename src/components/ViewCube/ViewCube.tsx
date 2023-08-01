import './ViewCube.css';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { cubeFace, ViewCubeProps } from './ViewCube.types';

const generateCubeFace = (text: string) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  canvas.width = 200;
  canvas.height = 200;

  ctx.fillStyle = '#d6dee8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = '40px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  return texture;
};

const generateCubeFaces = () => {
  const order = ['RIGHT', 'LEFT', 'TOP', 'BOTTOM', 'FRONT', 'BACK'];
  const textures = [];
  for (const text of order) {
    textures.push(
      new THREE.MeshBasicMaterial({
        map: generateCubeFace(text),
      })
    );
  }
  return textures;
};

const generateCubeMesh = () => {
  const geometry = new THREE.BoxGeometry(1350 / 1.5, 1350 / 1.5, 1350 / 1.5);
  const cube = new THREE.Mesh(geometry, generateCubeFaces());
  const edgesGeometry = new THREE.EdgesGeometry(cube.geometry);
  const edgesMaterial = new THREE.LineBasicMaterial({
    color: 0x808080,
    linewidth: 10,
  });
  var edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
  cube.add(edges);
  cube.position.set(0, 0, 0);
  return cube;
};

const cubeFacesMap = {
  0: 'RIGHT',
  1: 'RIGHT',
  2: 'LEFT',
  3: 'LEFT',
  4: 'TOP',
  5: 'TOP',
  6: 'BOTTOM',
  7: 'BOTTOM',
  8: 'FRONT',
  9: 'FRONT',
  10: 'BACK',
  11: 'BACK',
};

const ViewCube: React.FC<ViewCubeProps> = ({
  camera: cameraRef,
  onClick: onViewCubeClick,
  enableInteraction = true,
}) => {
  const enableInteractionRef = useRef<boolean>(enableInteraction);
  useEffect(() => {
    const elem = document.getElementById('view-cube') as HTMLElement;
    let camera = new THREE.PerspectiveCamera(
      70,
      elem.clientWidth / elem.clientHeight,
      1,
      5000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(elem.clientWidth, elem.clientHeight);
    elem.replaceChildren(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;
    controls.autoRotateSpeed = 0.75;
    controls.enableZoom = false;
    controls.minDistance = 2000;
    controls.maxDistance = 2000;

    var scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 1.5));

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    scene.add(generateCubeMesh());

    const animate = function () {
      if (cameraRef.current) {
        camera.position.copy(cameraRef.current?.position);
        camera.rotation.copy(cameraRef.current?.rotation);
      }
      if (enableInteractionRef.current !== null)
        controls.enabled = enableInteractionRef.current;
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize listener
    const resizeListener = () => {
      renderer.setSize(elem.clientWidth, elem.clientHeight);
      camera.aspect = elem.clientWidth / elem.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resizeListener, false);

    // Click listener
    const clickListener = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();

      pointer.x =
        ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
      pointer.y =
        -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0 && enableInteractionRef.current) {
        onViewCubeClick(
          cubeFacesMap[
            intersects[0].faceIndex as keyof typeof cubeFacesMap
          ] as cubeFace
        );
      }
    };
    window.addEventListener('click', clickListener);

    return () => {
      window.removeEventListener('resize', resizeListener, false);
      window.removeEventListener('click', clickListener);
    };
  }, [onViewCubeClick]);
  useEffect(() => {
    enableInteractionRef.current = enableInteraction;
  }, [enableInteraction]);
  return <div id="view-cube" className={'ViewCube'}></div>;
};

export default ViewCube;
