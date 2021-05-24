<?php
/**
    * 上传图片接口
	* @param field_name 必填 varchar 上传文件参数 
    * @return object json
    */
	public function uImages(){
		// print_r($_FILES);exit;

		$time = time();
        if (isset($_FILES['file']['name'])){

            $fileName		= (microtime(get_as_float)*1000).'.'.string_ext::getExt($_FILES['file']['name']); //存储name
            $uploaded_file	= $_FILES['file']['tmp_name'];
            $path			= $_SERVER['DOCUMENT_ROOT']."/upload/image/".date("Ymd",$time)."/".$fileName;//存储path
            $dir			= $_SERVER['DOCUMENT_ROOT']."/upload/image/".date("Ymd",$time);//判断文件夹是否存在
            // print_r($dir);exit;

            if (!file_exists($dir)){
                mkdir ($dir,0777,true);//不存在 创建新文件夹
                $panduan	= move_uploaded_file($uploaded_file, $path);//存入图片
            } else {
                $panduan	= move_uploaded_file($uploaded_file, $path);//存入已有文件夹内
            }
            if($panduan){
                $pic_url	= "/upload/image/".date("Ymd",$time)."/".$fileName;
                $result['data'] = $pic_url;
            }
        }
        echo json_encode($result);
        exit;
	}