import './StlExplorer.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import ViewCube from '../ViewCube';
import DragAndDrop from '../DragAndDrop';
import FullViewToggle from '../FullViewToggle';
import { cubeFace } from '../ViewCube/ViewCube.types';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

const StlExplorer: React.FC = () => {
  const stlViewerRef = useRef(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const stlGeometry =
    useRef<THREE.BufferGeometry<THREE.NormalBufferAttributes> | null>(null);
  const [stlUrl, setStlUrl] = useState<string>();
  useEffect(() => {
    if (!stlUrl) return setIsDragAndDropVisible(true);
    if (!stlViewerRef.current) return;
    let isDisposed = false;
    const elem = stlViewerRef.current as HTMLElement;
    const camera = new THREE.PerspectiveCamera(
      70,
      elem.clientWidth / elem.clientHeight,
      1,
      2000
    );
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(elem.clientWidth, elem.clientHeight);
    elem.replaceChildren(renderer.domElement);
    const resizeListener = () => {
      renderer.setSize(elem.clientWidth, elem.clientHeight);
      cameraRef.current!.aspect = elem.clientWidth / elem.clientHeight;
      cameraRef.current!.updateProjectionMatrix();
    };
    window.addEventListener('resize', resizeListener, false);
    var controls = new OrbitControls(cameraRef.current!, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;
    controls.autoRotateSpeed = 0.75;

    var scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xffffff, 1.5));

    const loader = new STLLoader();
    loader.load(stlUrl, (geometry) => {
      stlGeometry.current = geometry;
      const material = new THREE.MeshPhongMaterial({
        color: 0x808080,
        specular: 100,
        shininess: 100,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const middle = new THREE.Vector3();
      geometry.computeBoundingBox();
      geometry.boundingBox!.getCenter(middle);
      mesh.geometry.applyMatrix4(
        new THREE.Matrix4().makeTranslation(-middle.x, -middle.y, -middle.z)
      );

      const largestDimension = Math.max(
        geometry.boundingBox!.max.x,
        geometry.boundingBox!.max.y,
        geometry.boundingBox!.max.z
      );
      cameraRef.current!.position.z = largestDimension * 1.5;

      const animate = function () {
        setCamera(cameraRef.current!.clone());
        if (!isDisposed) requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      animate();
    });
    function handleFullscreenChange() {
      if (document.fullscreenElement) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
      }
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    return () => {
      isDisposed = true;
      window.removeEventListener('resize', resizeListener, false);
      renderer.dispose();
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      );
      document.removeEventListener(
        'msfullscreenchange',
        handleFullscreenChange
      );
    };
  }, [stlUrl]);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>();
  const onViewCubeClick = useCallback((face: cubeFace) => {
    const facePositions = {
      TOP: [0, Math.abs(stlGeometry.current!.boundingBox!.max.x * 1.5), 0],
      BOTTOM: [0, -Math.abs(stlGeometry.current!.boundingBox!.max.x * 1.5), 0],
      FRONT: [0, 0, Math.abs(stlGeometry.current!.boundingBox!.max.x * 1.5)],
      BACK: [0, 0, -Math.abs(stlGeometry.current!.boundingBox!.max.x * 1.5)],
      LEFT: [-Math.abs(stlGeometry.current!.boundingBox!.max.x * 1.5), 0, 0],
      RIGHT: [Math.abs(stlGeometry.current!.boundingBox!.max.x * 1.5), 0, 0],
    };
    const position = facePositions[face] || [0, 0, 0];
    cameraRef.current!.position.set(position[0], position[1], position[2]);
  }, []);

  const [isDragAndDropVisible, setIsDragAndDropVisible] = useState(false);

  const dropZoneRef = useRef(null);
  const handleDragEnter = (event: any) => {
    event.preventDefault();
    setIsDragAndDropVisible(true);
  };
  const handleDragOver = (event: any) => {
    event.preventDefault();
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragAndDropVisible(false);
    const file = event.dataTransfer.files[0];
    if (file) setStlUrl(URL.createObjectURL(file));
  };
  const fullViewToggleOnClick = () => {
    const elem = dropZoneRef.current as any;

    if (!isFullScreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  const [isFullScreen, setIsFullScreen] = useState(false);
  return (
    <div
      className={'StlViewer'}
      ref={dropZoneRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
    >
      <div ref={stlViewerRef} className={'StlViewerMain'} />
      <ViewCube camera={cameraRef} onClick={onViewCubeClick} />
      <FullViewToggle
        onClick={fullViewToggleOnClick}
        isFullScreen={isFullScreen}
      />
      <DragAndDrop isVisible={isDragAndDropVisible} />
    </div>
  );
};

export default StlExplorer;
