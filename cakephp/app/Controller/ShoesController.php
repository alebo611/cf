<?php
class ShoesController extends AppController {
    public $helpers = array('Html', 'Form');
    public $components = array('RequestHandler');


    public function index() {
        $this->set('shoes', $this->Shoe->find('all'));
    }


    public function view($id = null) {
        if (!$id) {
            throw new NotFoundException(__('Invalid Shoe'));
        }

        $shoe = $this->Shoe->findById($id);
        if (!$shoe) {
            throw new NotFoundException(__('Invalid Shoe'));
        }
        $this->set('shoe', $shoe);
        $this->set(array('shoe' => $shoe, '_serialize' => 'shoe'));
    }

    public function getAllForSale($name=null) {
            /* always keep a buffer in the stock to prevent somebody from order out of stock items 1 */
            $limit=2;
            
            if(!$name){
               $this->set('shoes', $this->Shoe->query("SELECT name,color,size FROM shoes where in_stock > $limit;"));
            }
            else {
               $this->set('shoes', $this->Shoe->query("SELECT color,size FROM shoes where name = '$name' AND in_stock > $limit;"));
            }
           $this->set('_serialize', array('shoes'));

    }


     public function add() {
        if ($this->request->is('post')) {
            $this->Shoe->create();
            if ($this->Shoe->save($this->request->data)) {
                $this->Session->setFlash(__('Your shoe has been saved.'));
                return $this->redirect(array('action' => 'index'));
            }
            $this->Session->setFlash(__('Unable to add your Shoe.'));
        }
    }

    public function edit($id = null) {
    if (!$id) {
        throw new NotFoundException(__('Invalid post'));
    }

    $shoe = $this->Shoe->findById($id);
    if (!$shoe) {
        throw new NotFoundException(__('Invalid Shoe'));
    }

    if ($this->request->is(array('post', 'put'))) {
        $this->Shoe->id = $id;
        if ($this->Shoe->save($this->request->data)) {
            $this->Session->setFlash(__('Your post has been updated.'));
            return $this->redirect(array('action' => 'index'));
        }
        $this->Session->setFlash(__('Unable to update your post.'));
    }

    if (!$this->request->data) {
        $this->request->data = $shoe;
    }
        $this->set('shoe', $shoe);
    }


    public function delete($id) {
    if ($this->request->is('get')) {
        throw new MethodNotAllowedException();
    }

    if ($this->Shoe->delete($id)) {
        $this->Session->setFlash(
            __('The post with id: %s has been deleted.', h($id))
        );
        return $this->redirect(array('action' => 'index'));
    }
}
}
?>
