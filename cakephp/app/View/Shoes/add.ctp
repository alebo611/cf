<!-- File: /app/View/Posts/add.ctp -->

<h1>Add Shoe</h1>
<?php
echo $this->Form->create('Shoe');
echo $this->Form->input('id', array('type' => 'hidden'));
echo $this->Form->input('name');
echo $this->Form->input('color');
echo $this->Form->input('size');
echo $this->Form->input('in_stock');
echo $this->Form->end('Save Shoe');
?>
